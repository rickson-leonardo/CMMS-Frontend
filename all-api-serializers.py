# src/apps/core/api/serializers.py

from rest_framework import serializers
from ..models import Map, Location

class MapSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Map. Lida com o upload de imagens.
    'image' é usado para upload (write-only), e 'image_url' é para exibição (read-only).
    """
    image = serializers.ImageField(write_only=True, required=True)
    image_url = serializers.CharField(source='image.url', read_only=True)

    class Meta:
        model = Map
        fields = ('id', 'name', 'image', 'image_url', 'created_at')
        read_only_fields = ('id', 'image_url', 'created_at')

class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Location, incluindo os novos campos de mapa.
    """
    class Meta:
        model = Location
        fields = [
            'id',
            'name',
            'description',
            'map',
            'x_coordinate',
            'y_coordinate',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

# src/apps/tickets/api/serializers.py

from rest_framework import serializers
from apps.core.models import User, Asset
from apps.tickets.models import Ticket

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para exibir informações do usuário.
    """
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email']

class AssetSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para exibir informações do ativo.
    """
    class Meta:
        model = Asset
        fields = ['id', 'name', 'asset_tag']

class TicketSerializer(serializers.ModelSerializer):
    """
    Serializer para visualização detalhada de um Ticket.
    """
    requester = UserSerializer(read_only=True)
    asset = AssetSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id',
            'title',
            'description',
            'status',
            'priority',
            'created_at',
            'requester',
            'asset',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'requester', 'asset']

class TicketCreateSerializer(serializers.ModelSerializer):
    """
    Serializer específico para a criação de um novo Ticket.
    """
    asset_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Ticket
        fields = [
            'title',
            'description',
            'priority',
            'asset_id'
        ]

    def create(self, validated_data):
        """
        Associa o requester (usuário logado) durante a criação do ticket.
        """
        validated_data['requester'] = self.context['request'].user
        return super().create(validated_data)

#src/apps/work_orders/api/serializers.py
from rest_framework import serializers
from apps.work_orders.models import WorkOrder
from apps.core.models import User, Asset

# --- Serializers Aninhados "Slim" ---
# Para evitar expor todos os dados de modelos relacionados.

class UserSlimSerializer(serializers.ModelSerializer):
    """Serializer simplificado para usuários."""
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email']

class AssetSlimSerializer(serializers.ModelSerializer):
    """Serializer simplificado para ativos."""
    class Meta:
        model = Asset
        fields = ['id', 'name', 'asset_tag']

# --- Serializers Principais da WorkOrder ---

class WorkOrderSerializer(serializers.ModelSerializer):
    """
    Serializer para listar e detalhar Ordens de Serviço com dados aninhados.
    """
    # Usando os serializers "slim" para representação de leitura.
    asset = AssetSlimSerializer(read_only=True)
    assigned_to = UserSlimSerializer(read_only=True)

    # IDs para escrita, permitindo que o frontend envie apenas o UUID.
    asset_id = serializers.UUIDField(write_only=True, source='asset')
    assigned_to_id = serializers.UUIDField(write_only=True, source='assigned_to', allow_null=True, required=False)

    class Meta:
        model = WorkOrder
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'asset', 'assigned_to', 'created_at', 'updated_at',
            'scheduled_start', 'completed_at', 'asset_id', 'assigned_to_id'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'asset', 'assigned_to']

class WorkOrderCreateSerializer(serializers.ModelSerializer):
    """
    Serializer otimizado para a criação de novas Ordens de Serviço.
    Usa o `asset_id` para vincular a um ativo existente.
    """
    asset_id = serializers.UUIDField(write_only=True, source='asset')

    class Meta:
        model = WorkOrder
        fields = [
            'title',
            'description',
            'priority',
            'asset_id',
            'scheduled_start',
        ]

    def create(self, validated_data):
        # O status inicial é definido no próprio modelo como 'awaiting_approval'
        return WorkOrder.objects.create(**validated_data)