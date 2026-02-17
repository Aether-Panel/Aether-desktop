using Aether.Helpers;

namespace Aether.Features.Login;

public partial class LoginPage : ContentPage
{
    private readonly LoginViewModel _viewModel;

    public LoginPage()
    {
        InitializeComponent();
        _viewModel = new LoginViewModel();
        BindingContext = _viewModel;
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

        // Hide any previous error/validation messages
        ErrorMessage.IsVisible = false;
        EmailValidationLabel.IsVisible = false;
        PasswordValidationLabel.IsVisible = false;

        // Per-field validation
        bool hasErrors = false;

        if (string.IsNullOrWhiteSpace(_viewModel.Username) || !_viewModel.Username.Contains('@'))
        {
            EmailValidationLabel.IsVisible = true;
            hasErrors = true;
        }

        if (string.IsNullOrWhiteSpace(_viewModel.Password) || _viewModel.Password.Length < 8)
        {
            PasswordValidationLabel.IsVisible = true;
            hasErrors = true;
        }

        if (hasErrors)
        {
            // Shake animation for error
            await LoginButton.ShakeAsync();
            return;
        }

        // Show loading state
        LoginButton.IsLoading = true;

        // Validate against JSON credentials
        var isValid = await Services.AuthService.Instance.ValidateCredentialsAsync(
            _viewModel.Username, _viewModel.Password);

        if (isValid)
        {
            // Navigate to DashboardPage
            await Shell.Current.GoToAsync("//DashboardPage");
        }
        else
        {
            // Show error
            ErrorMessage.Text = "Usuario o contraseña incorrectos. Intente nuevamente.";
            ErrorMessage.IsVisible = true;

            await PasswordEntry.ShakeAsync();

            LoginButton.IsLoading = false;
        }
    }

    private async void OnRegisterButtonClicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("//RegisterPage");
    }

    private async void OnForgotPasswordClicked(object sender, EventArgs e) => await DisplayAlertAsync("Recuperar contraseña",
        "Se enviará un enlace de recuperación a tu correo electrónico.", "Aceptar");


    private void OnPasswordToggleClicked(object sender, EventArgs e)
    {
        PasswordEntry.IsPassword = !PasswordEntry.IsPassword;
        var image = (Image)sender;
        image.Opacity = PasswordEntry.IsPassword ? 0.5 : 1.0;
    }

    // Handle keyboard appearance for better UX
    protected override void OnSizeAllocated(double width, double height)
    {
        base.OnSizeAllocated(width, height);

        // Adjust padding for smaller screens
        if (width < 400) MainContainer.Padding = new Thickness(16, 20, 16, 20);
    }
}
