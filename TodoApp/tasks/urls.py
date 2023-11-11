from django.urls import path
from django.contrib.auth.views import LogoutView
from django.urls import reverse_lazy
from . views import (TaskListView,
                     TaskDetailView,
                     TaskCreateView,
                     TaskDeleteView,
                     CreateUserView,
                     LoginView)

app_name = 'tasks'
urlpatterns = [
    path("", TaskListView.as_view(), name="home"),
    path("detail/<int:id>/", TaskDetailView.as_view(), name="detail"),
    path("delete/", TaskDeleteView.as_view(), name="delete"),
    path("save/", TaskCreateView.as_view(), name="create"),
    path("save/<int:id>/", TaskCreateView.as_view(), name="create-param"),
    path("register/", CreateUserView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(next_page=reverse_lazy('tasks:register')), name="logout"),
]
