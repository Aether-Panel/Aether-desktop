using Microsoft.Maui.Controls;
using Aether.Controls;

namespace Aether.Views
{
    public partial class LoginPage : ContentPage
    {
        public LoginPage()
        {
            InitializeComponent();
            BindingContext = new LoginViewModel();
            SetupAnimations();
        }

        private void SetupAnimations()
        {
            // Set initial opacity for fade-in animation
            LoginContent.Opacity = 0;
            TitleLabel.TranslationY = -20;
            FormSection.TranslationY = 20;
            ButtonSection.TranslationY = 20;
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            
            // Animate content appearing
            await Task.WhenAll(
                LoginContent.FadeToAsync(1, 200, Easing.SinOut),
                TitleLabel.TranslateToAsync(0, 0, 300, Easing.SinOut),
                FormSection.TranslateToAsync(0, 0, 350, Easing.SinOut),
                ButtonSection.TranslateToAsync(0, 0, 400, Easing.SinOut)
            );
        }

        private async void OnLoginButtonClicked(object sender, EventArgs e)
        {
            var viewModel = BindingContext as LoginViewModel;
            
            // Hide any previous error messages
            ErrorMessage.IsVisible = false;
            
            // Show loading state
            LoginButton.IsLoading = true;
            
            // Basic validation
            if (string.IsNullOrWhiteSpace(viewModel.Username) || 
                string.IsNullOrWhiteSpace(viewModel.Password))
            {
                ErrorMessage.Text = "Por favor, complete todos los campos.";
                ErrorMessage.IsVisible = true;
                LoginButton.IsLoading = false;
                
                // Shake animation for error
                await ShakeAnimation(LoginButton);
                return;
            }
            
            // Simulate login process (mock)
            await Task.Delay(1500);
            
            // Mock authentication - accept any non-empty credentials
            if (viewModel.Username.Length >= 3 && viewModel.Password.Length >= 6)
            {
                // Success - navigate to main app
                await Application.Current!.Windows[0].Page!.DisplayAlertAsync(
                    "¡Bienvenido!", 
                    $"Inicio de sesión exitoso. Bienvenido {viewModel.Username}!", 
                    "OK");
                
                // Navigate to MainPage (you can change this to your main app page)
                Application.Current.Windows[0].Page = new AppShell();
            }
            else
            {
                // Show error
                ErrorMessage.Text = "Usuario o contraseña incorrectos. Intente nuevamente.";
                ErrorMessage.IsVisible = true;
                
                await ShakeAnimation(PasswordEntry);
                LoginButton.IsLoading = false;
            }
        }

        private async void OnRegisterButtonClicked(object sender, EventArgs e)
        {
            await Application.Current!.Windows[0].Page!.DisplayAlertAsync(
                "Registro", 
                "La funcionalidad de registro estará disponible próximamente.", 
                "OK");
        }

        private void OnPasswordToggleClicked(object sender, EventArgs e)
        {
            PasswordEntry.IsPassword = !PasswordEntry.IsPassword;
            var button = (Button)sender;
            button.Text = PasswordEntry.IsPassword ? "👁" : "👁‍🗨";
        }

        private async Task ShakeAnimation(VisualElement element)
        {
            await element.TranslateToAsync(-10, 0, 50, Easing.SinOut);
            await element.TranslateToAsync(10, 0, 50, Easing.SinOut);
            await element.TranslateToAsync(-10, 0, 50, Easing.SinOut);
            await element.TranslateToAsync(10, 0, 50, Easing.SinOut);
            await element.TranslateToAsync(0, 0, 50, Easing.SinOut);
        }

        // Handle keyboard appearance for better UX
        protected override void OnSizeAllocated(double width, double height)
        {
            base.OnSizeAllocated(width, height);
            
            // Adjust padding for smaller screens
            if (width < 400)
            {
                MainContainer.Padding = new Thickness(16, 20, 16, 20);
            }
        }
    }

    public class LoginViewModel : BindableObject
    {
        private string _username;
        private string _password;

        public string Username
        {
            get => _username;
            set
            {
                _username = value;
                OnPropertyChanged(nameof(Username));
            }
        }

        public string Password
        {
            get => _password;
            set
            {
                _password = value;
                OnPropertyChanged(nameof(Password));
            }
        }
    }
}