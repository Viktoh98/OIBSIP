from django.urls import path
from django.contrib.auth.views import LogoutView
from django.urls import reverse_lazy
from . views import HomeView, CreateUserView, LoginView

app_name = 'protected'
urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("register/", CreateUserView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(next_page=reverse_lazy('protected:register')), name="logout"),
]
