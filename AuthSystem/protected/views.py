from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from . forms import CustomUserCreationForm
from django.contrib.auth import authenticate, login


class HomeView(LoginRequiredMixin, View):
    template_name = 'index.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {})


class CreateUserView(View):
    form = CustomUserCreationForm
    template = 'registration/register.html'

    def get(self, request):
        return render(request, self.template, {'form': self.form()})

    def post(self, request):
        form = self.form(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('protected:home')
        else:
            error_messages = {}
            for field, errors in form.errors.items():
                for error in errors:
                    error_messages[field] = error
                    print(error)
            context = {
                'form': CustomUserCreationForm(),
                'messages': error_messages
            }
            return render(request, self.template, context)


class LoginView(View):
    template = 'registration/register.html'

    def get(self, request):
        return render(request, self.template, {})

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('protected:home')
        else:
            context = {
                'message': 'Invalid username or password'
            }
            return render(request, self.template, context)
