#src/apps/work_orders/services.py
from django.db import transaction
from django.utils import timezone
from django.db.models import F

# Imports dos modelos de outras aplicações
from apps.core.models import User, Part, InventoryTransaction
from apps.tickets.models import Ticket

# Imports dos modelos desta aplicação
from .models import WorkOrder, WorkOrderPhoto, WorkOrderPart


class WorkOrderService:
    """
    Encapsula a lógica de negócio para Ordens de Serviço (Work Orders).
    Este padrão está alinhado com a Seção 2.3 do Guia Arquitetural.md.
    """

    @staticmethod
    @transaction.atomic
    def criar_os_a_partir_de_ticket(ticket: Ticket) -> WorkOrder:
        """
        Cria uma Ordem de Serviço (OS) a partir de um Ticket existente.
        Implementa a "Fase 1: Triagem e Criação da Ordem de Serviço".
        """
        # Verificação 1: Checa se já existe uma OS para este ticket.
        if WorkOrder.objects.filter(ticket=ticket).exists():
            raise ValueError(f"Já existe uma Ordem de Serviço para o Ticket ID {ticket.id}.")

        # Verificação 2: Checa se o status do ticket permite a criação de uma OS.
        if ticket.status in ['resolved', 'closed']:
            raise ValueError(f"Não é possível criar uma OS para um Ticket com status '{ticket.status}'.")

        # Criação da nova WorkOrder, usando 'on_hold' para aguardar aprovação.
        work_order = WorkOrder.objects.create(
            title=ticket.title,
            description=ticket.description,
            asset=ticket.asset,
            ticket=ticket,
            status='on_hold',
            priority=3
        )

        # Atualiza o status do Ticket para indicar que está sendo tratado.
        ticket.status = 'pending'
        ticket.save(update_fields=['status'])

        return work_order

    @staticmethod
    @transaction.atomic
    def aprovar_os_manutencao(ordem_de_servico: WorkOrder, usuario_aprovador: User) -> WorkOrder:
        """
        Registra a aprovação da equipe de manutenção para uma Ordem de Serviço.
        """
        return WorkOrderService._processar_aprovacao(
            ordem_de_servico, usuario_aprovador, 'maintenance'
        )

    @staticmethod
    @transaction.atomic
    def aprovar_os_producao(ordem_de_servico: WorkOrder, usuario_aprovador: User) -> WorkOrder:
        """
        Registra a aprovação da equipe de produção para uma Ordem de Serviço.
        """
        return WorkOrderService._processar_aprovacao(
            ordem_de_servico, usuario_aprovador, 'production'
        )

    @staticmethod
    def _processar_aprovacao(ordem_de_servico: WorkOrder, usuario_aprovador: User, tipo_aprovacao: str) -> WorkOrder:
        """
        Método auxiliar privado para lidar com a lógica de aprovação.
        """
        if usuario_aprovador.role not in ['manager', 'admin']:
            raise PermissionError("O usuário não tem permissão para aprovar Ordens de Serviço.")

        if ordem_de_servico.status != 'on_hold':
            raise ValueError(f"A Ordem de Serviço não está no estado 'on_hold', mas sim '{ordem_de_servico.status}'.")

        if tipo_aprovacao == 'maintenance':
            if ordem_de_servico.maintenance_approver:
                raise ValueError("A Ordem de Serviço já foi aprovada pela manutenção.")
            ordem_de_servico.maintenance_approver = usuario_aprovador
            ordem_de_servico.maintenance_approved_at = timezone.now()
        
        elif tipo_aprovacao == 'production':
            if ordem_de_servico.production_approver:
                raise ValueError("A Ordem de Serviço já foi aprovada pela produção.")
            ordem_de_servico.production_approver = usuario_aprovador
            ordem_de_servico.production_approved_at = timezone.now()

        # Se ambas as aprovações foram concedidas, a OS é liberada.
        if ordem_de_servico.maintenance_approved_at and ordem_de_servico.production_approved_at:
            ordem_de_servico.status = 'open'

        ordem_de_servico.save()
        return ordem_de_servico
    
    @staticmethod
    @transaction.atomic
    def iniciar_trabalho_os(ordem_de_servico: WorkOrder, usuario_tecnico: User) -> WorkOrder:
        """
        Muda o status de uma OS para 'in_progress' e registra o início real do trabalho.
        """
        if ordem_de_servico.status != 'open':
            raise ValueError(f"A Ordem de Serviço não pode ser iniciada, pois seu status é '{ordem_de_servico.status}'.")

        if not (ordem_de_servico.assigned_to == usuario_tecnico or usuario_tecnico.role in ['manager', 'admin']):
            raise PermissionError("Usuário não é o técnico atribuído a esta Ordem de Serviço.")
            
        ordem_de_servico.status = 'in_progress'
        ordem_de_servico.actual_start_at = timezone.now()
        ordem_de_servico.save(update_fields=['status', 'actual_start_at'])

        return ordem_de_servico

    @staticmethod
    @transaction.atomic
    def concluir_trabalho_os(
        ordem_de_servico: WorkOrder,
        dados_de_conclusao: dict,
        usuario_tecnico: User
    ) -> WorkOrder:
        """
        Finaliza uma OS, registrando detalhes, atualizando inventário e salvando fotos.
        """
        if ordem_de_servico.status != 'in_progress':
            raise ValueError(f"A OS não pode ser concluída, pois seu status é '{ordem_de_servico.status}'.")

        if not (ordem_de_servico.assigned_to == usuario_tecnico or usuario_tecnico.role in ['manager', 'admin']):
            raise PermissionError("Usuário não tem permissão para concluir esta Ordem de Serviço.")

        # 1. Atualiza os campos da Ordem de Serviço principal
        ordem_de_servico.status = 'completed'
        ordem_de_servico.completed_at = timezone.now()
        ordem_de_servico.root_cause = dados_de_conclusao.get('root_cause')
        ordem_de_servico.action_taken = dados_de_conclusao.get('action_taken')
        ordem_de_servico.next_os_recommendation = dados_de_conclusao.get('next_os_recommendation')
        
        # 2. Processa as peças utilizadas
        parts_used = dados_de_conclusao.get('parts_used', [])
        for part_info in parts_used:
            part_id = part_info.get('part_id')
            quantity = part_info.get('quantity_used')
            
            if not part_id or not quantity or quantity <= 0:
                continue

            part = Part.objects.get(id=part_id)
            
            WorkOrderPart.objects.create(
                work_order=ordem_de_servico,
                part=part,
                quantity_used=quantity
            )
            
            InventoryTransaction.objects.create(
                part=part,
                work_order=ordem_de_servico,
                transaction_type='deduction',
                quantity_changed=quantity,
                user=usuario_tecnico
            )
            
            part.quantity_on_hand = F('quantity_on_hand') - quantity
            part.save(update_fields=['quantity_on_hand'])

        # 3. Processa as fotos
        photos = dados_de_conclusao.get('photos', [])
        for photo_file in photos:
            WorkOrderPhoto.objects.create(
                work_order=ordem_de_servico,
                photo=photo_file,
                uploaded_by=usuario_tecnico
            )
            
        ordem_de_servico.save()
        return ordem_de_servico


##src/apps/tickets/services.py

from django.db import transaction
from django.utils import timezone

# Imports dos modelos
from apps.core.models import User
from apps.tickets.models import Ticket, Feedback
from apps.work_orders.models import WorkOrder

class TicketService:
    """
    Encapsula a lógica de negócio para Tickets.
    """

    @staticmethod
    @transaction.atomic
    def resolver_ticket_apos_os(ticket: Ticket, usuario_gerente: User) -> Ticket:
        """
        Altera o status de um Ticket para 'resolved' após a conclusão da OS associada.
        """
        if usuario_gerente.role not in ['manager', 'admin']:
            raise PermissionError("O usuário não tem permissão para resolver tickets.")

        if ticket.status != 'pending':
            raise ValueError(f"O ticket não pode ser resolvido pois seu status é '{ticket.status}'.")

        try:
            work_order = WorkOrder.objects.get(ticket=ticket)
            if work_order.status != 'completed':
                raise ValueError(
                    f"A Ordem de Serviço associada (ID: {work_order.id}) ainda não foi concluída."
                )
        except WorkOrder.DoesNotExist:
            raise ValueError("Não há Ordem de Serviço associada a este ticket para verificar a conclusão.")

        ticket.status = 'resolved'
        ticket.save(update_fields=['status'])
        return ticket

    @staticmethod
    @transaction.atomic
    def submeter_feedback(
        ticket: Ticket,
        usuario_solicitante: User,
        rating: int,
        comments: str = ""
    ) -> Feedback:
        """
        Permite que o solicitante original de um ticket envie seu feedback
        após a resolução do mesmo.
        """
        if ticket.requester != usuario_solicitante:
            raise PermissionError("Apenas o solicitante original pode enviar feedback para este ticket.")

        if ticket.status != 'resolved':
            raise ValueError(f"Feedback só pode ser enviado para tickets resolvidos. Status atual: '{ticket.status}'.")
        
        if Feedback.objects.filter(ticket=ticket).exists():
            raise ValueError("Já existe um feedback registrado para este ticket.")

        feedback = Feedback.objects.create(
            ticket=ticket,
            user=usuario_solicitante,
            rating=rating,
            comments=comments
        )
        return feedback

    # --- NOVO MÉTODO FINAL ---
    @staticmethod
    @transaction.atomic
    def fechar_ticket(ticket: Ticket, usuario_gerente: User) -> Ticket:
        """
        Altera o status de um Ticket de 'resolved' para 'closed'.
        Esta é a etapa final do ciclo de vida do ticket.
        """
        # Verificação de Permissão: Apenas gerentes ou administradores podem fechar tickets.
        if usuario_gerente.role not in ['manager', 'admin']:
            raise PermissionError("O usuário não tem permissão para fechar tickets.")

        # Verificação de Estado: O ticket deve estar 'resolved' para ser fechado.
        if ticket.status != 'resolved':
            raise ValueError(f"O ticket não pode ser fechado pois seu status é '{ticket.status}'.")

        # Atualiza o status do ticket
        ticket.status = 'closed'
        ticket.save(update_fields=['status'])
        
        return ticket