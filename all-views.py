# src/apps/core/api/views.py

from rest_framework import generics, permissions
from ..models import Map, Location
from .serializers import MapSerializer, LocationSerializer

class MapListCreateAPIView(generics.ListCreateAPIView):
    """
    View para listar e criar Mapas.
    Requer autenticação.
    """
    queryset = Map.objects.all()
    serializer_class = MapSerializer
    permission_classes = [permissions.IsAuthenticated]

class LocationListCreateAPIView(generics.ListCreateAPIView):
    """
    View para listar e criar Localizações.
    Requer autenticação.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]

#src/apps/work_orders/api/views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from apps.work_orders.models import WorkOrder
from .serializers import WorkOrderSerializer, WorkOrderCreateSerializer
from apps.core.api.permissions import IsManagerUser
from .permissions import IsManagerOrAssignedTechnician

class WorkOrderListCreateAPIView(generics.ListCreateAPIView):
    """
    View para listar todas as Ordens de Serviço e criar uma nova.
    - Qualquer usuário autenticado pode listar.
    - Apenas Gerentes (Managers) podem criar.
    """
    queryset = WorkOrder.objects.select_related('asset', 'assigned_to').all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return WorkOrderCreateSerializer
        return WorkOrderSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated, IsManagerUser]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

class WorkOrderDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    View para detalhar, atualizar e deletar uma Ordem de Serviço específica.
    - Qualquer usuário autenticado pode ver os detalhes.
    - Apenas Gerentes ou o Técnico atribuído podem atualizar ou deletar.
    """
    queryset = WorkOrder.objects.select_related('asset', 'assigned_to').all()
    serializer_class = WorkOrderSerializer
    permission_classes = [IsAuthenticated, IsManagerOrAssignedTechnician]
    lookup_field = 'id'

    def get_serializer_context(self):
        """Adiciona o request ao contexto do serializer."""
        return {'request': self.request}
    
#src/apps/tickets/api/views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

# Importando nossos modelos e serializers
from apps.tickets.models import Ticket
from .serializers import TicketSerializer, TicketCreateSerializer

# Importando nossas novas permissões customizadas
from apps.core.api.permissions import CanCreateTicket, IsOwnerOrReadOnly

class TicketListCreateAPIView(generics.ListCreateAPIView):
    """
    View para listar todos os tickets (GET) e criar um novo ticket (POST).
    """
    queryset = Ticket.objects.all().select_related('asset', 'requester')
    
    def get_serializer_class(self):
        """
        Retorna o serializer apropriado com base na ação (criação ou listagem).
        """
        if self.request.method == 'POST':
            return TicketCreateSerializer
        return TicketSerializer

    def get_permissions(self):
        """
        Define as permissões necessárias para a view.
        - Para criar (POST), o usuário deve ter a permissão 'CanCreateTicket'.
        - Para outras ações (GET), o usuário deve estar simplesmente autenticado.
        """
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated, CanCreateTicket]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_create(self, serializer):
        """
        Define o 'requester' do ticket como o usuário autenticado que fez a requisição.
        """
        serializer.save(requester=self.request.user)


class TicketDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    View para ver, atualizar ou deletar um ticket específico.
    """
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    lookup_field = 'id'