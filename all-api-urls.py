#src/apps/work_orders/api/urls.py

from django.urls import path
from .views import WorkOrderListCreateAPIView, WorkOrderDetailAPIView

urlpatterns = [
    path('', WorkOrderListCreateAPIView.as_view(), name='workorder-list-create'),
    path('<uuid:id>/', WorkOrderDetailAPIView.as_view(), name='workorder-detail'),
]


#src/apps/tickets/api/urls.py

from django.urls import path
from .views import TicketListCreateAPIView, TicketDetailAPIView

# O 'app_name' ajuda a organizar as URLs e a evitar conflitos de nomes.
app_name = 'tickets_api'

urlpatterns = [
    # Mapeia para a view que lista todos os tickets (GET) e cria um novo ticket (POST).
    # URL: /api/tickets/
    path('', TicketListCreateAPIView.as_view(), name='ticket-list-create'),

    # Mapeia para a view que retorna os detalhes de um ticket específico (GET).
    # O '<uuid:id>' captura o ID do ticket da URL.
    # URL: /api/tickets/<uuid>/
    path('<uuid:id>/', TicketDetailAPIView.as_view(), name='ticket-detail'),
]

# src/apps/core/api/urls.py

from django.urls import path
from .views import MapListCreateAPIView, LocationListCreateAPIView

app_name = 'core_api'

urlpatterns = [
    path('maps/', MapListCreateAPIView.as_view(), name='map-list-create'),
    path('locations/', LocationListCreateAPIView.as_view(), name='location-list-create'),
]