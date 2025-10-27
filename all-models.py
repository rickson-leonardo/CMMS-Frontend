# src/apps/tickets/models.py

import uuid
from django.db import models
from apps.core.models import User, Asset # Importa os modelos do app core

# --- Modelos de Tickets ---

class Ticket(models.Model):
    """
    Solicitações de serviço ou relatos de problemas abertos pelos usuários.
    """
    STATUS_CHOICES = [
        ('open', 'Aberto'),
        ('pending', 'Pendente'), # Aguardando OS
        ('resolved', 'Resolvido'),
        ('closed', 'Fechado'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    asset = models.ForeignKey(Asset, on_delete=models.SET_NULL, null=True, blank=True)
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tickets', null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tickets'
        verbose_name = 'Ticket'
        verbose_name_plural = 'Tickets'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class TicketComment(models.Model):
    """
    Comentários e atualizações em um ticket.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments', null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ticket_comments', null=True)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ticket_comments'
        verbose_name = 'Comentário de Ticket'
        verbose_name_plural = 'Comentários de Tickets'
        ordering = ['created_at']

class Feedback(models.Model):
    """
    Coleta o feedback do solicitante após a resolução de um ticket.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.OneToOneField(Ticket, on_delete=models.CASCADE, related_name='feedback', null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks', null=True)
    rating = models.IntegerField(help_text="Avaliação de 1 a 5")
    comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'feedback'
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedbacks'

# src/apps/core/models.py

import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# --- Gerenciador de Usuário Customizado ---
class CustomUserManager(BaseUserManager):
    """
    Gerenciador customizado para o nosso modelo de usuário.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O campo de Email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin') # Superusuários são admins

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superusuário deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superusuário deve ter is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

# --- Modelo de Usuário ---
class User(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de usuário customizado, usando email como identificador principal.
    """
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('manager', 'Gerente'),
        ('technician', 'Técnico'),
        ('requester', 'Solicitante'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='requester')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'

# --- Outros Modelos Core ---
class Map(models.Model):
    """
    Mapas visuais para localização de ativos e ordens de serviço.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True, verbose_name="Nome do Mapa")
    image = models.ImageField(upload_to='maps/', verbose_name="Arquivo de Imagem")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'maps'
        verbose_name = 'Mapa'
        verbose_name_plural = 'Mapas'

    def __str__(self):
        return self.name

class Location(models.Model):
    """
    Locais físicos onde os ativos estão instalados, agora com coordenadas.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    # Novos campos para o sistema de mapas
    map = models.ForeignKey(Map, on_delete=models.SET_NULL, null=True, blank=True, related_name='locations', verbose_name="Mapa")
    x_coordinate = models.IntegerField(null=True, blank=True, verbose_name="Coordenada X")
    y_coordinate = models.IntegerField(null=True, blank=True, verbose_name="Coordenada Y")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'locations'
        verbose_name = 'Localização'
        verbose_name_plural = 'Localizações'

class Asset(models.Model):
    """
    Equipamentos e outros ativos gerenciados pelo CMMS.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    asset_tag = models.CharField(max_length=100, unique=True, blank=True, null=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    criticality = models.IntegerField(default=3)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'assets'
        verbose_name = 'Ativo'
        verbose_name_plural = 'Ativos'

class Part(models.Model):
    """
    Peças e componentes utilizados na manutenção.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    part_number = models.CharField(max_length=100, unique=True, blank=True, null=True)
    quantity_on_hand = models.PositiveIntegerField(default=0)
    # Outros campos relevantes...

    class Meta:
        db_table = 'parts'
        verbose_name = 'Peça'
        verbose_name_plural = 'Peças'

class InventoryTransaction(models.Model):
    """
    Registra movimentações de peças no inventário.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    part = models.ForeignKey(Part, on_delete=models.CASCADE, related_name='inventory_transactions')
    quantity_changed = models.IntegerField()
    transaction_type = models.CharField(max_length=50) # ex: 'addition', 'deduction'
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # work_order = models.ForeignKey('work_orders.WorkOrder', ...) # Será adicionado depois

    class Meta:
        db_table = 'inventory_transactions'
        verbose_name = 'Transação de Inventário'
        verbose_name_plural = 'Transações de Inventário'

# src/apps/work_orders/models.py
import uuid
from django.db import models
from apps.core.models import Asset, Part, User
from apps.tickets.models import Ticket


# --- Work Order and Maintenance Models ---
# Models related to maintenance tasks and scheduling.

class WorkOrder(models.Model):
    """
    Represents a task to be performed on an asset.
    """
    STATUS_CHOICES = [
        ('awaiting_approval', 'Aguardando Aprovação'),
        ('open', 'Aberta'),
        ('in_progress', 'Em Progresso'),
        ('on_hold', 'Em Espera'),
        ('completed', 'Concluída'),
        ('closed', 'Fechada'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE,
        related_name='work_orders'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='assigned_work_orders'
    )
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='awaiting_approval'
    )
    priority = models.IntegerField(default=3)
    scheduled_start = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Vínculo com o Ticket de origem
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='work_orders'
    )

    # Campos de Aprovação
    maintenance_approver = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_maintenance_orders'
    )
    maintenance_approved_at = models.DateTimeField(null=True, blank=True)
    production_approver = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_production_orders'
    )
    production_approved_at = models.DateTimeField(null=True, blank=True)

    # Campos de Registro do Trabalho
    root_cause = models.TextField(blank=True, null=True)
    action_taken = models.TextField(blank=True, null=True)
    actual_start_at = models.DateTimeField(null=True, blank=True)
    next_os_recommendation = models.TextField(blank=True, null=True)
    
    parts = models.ManyToManyField(
        Part,
        through='WorkOrderPart',
        related_name='work_orders'
    )

    class Meta:
        db_table = 'work_orders'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class WorkOrderPhoto(models.Model):
    """
    Armazena referências a fotos associadas a uma ordem de serviço.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='photos')
    
    # NOTA: ImageField requer a biblioteca 'Pillow'. Instale com: pip install Pillow
    photo = models.ImageField(upload_to='work_order_photos/')
    
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='uploaded_photos')

    class Meta:
        db_table = 'work_order_photos'
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"Foto para OS {self.work_order.title} carregada em {self.uploaded_at}"

class WorkOrderPart(models.Model):
    """
    Intermediate model for the Many-to-Many relationship
    between WorkOrder and Part, storing the quantity used.
    """
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE)
    part = models.ForeignKey(Part, on_delete=models.PROTECT) # Don't delete part if used in a WO
    quantity_used = models.IntegerField()

    class Meta:
        db_table = 'work_order_parts'
        unique_together = ('work_order', 'part')

class PmSchedule(models.Model):
    """
    Define tarefas de manutenção preventiva agendadas.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='pm_schedules')
    frequency = models.PositiveIntegerField()
    frequency_unit = models.CharField(max_length=20, choices=[('days', 'Dias'), ('weeks', 'Semanas'), ('months', 'Meses')])
    last_pm_date = models.DateTimeField(null=True, blank=True)
    next_due_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'pm_schedules'
        verbose_name = 'Agendamento de PM'
        verbose_name_plural = 'Agendamentos de PM'