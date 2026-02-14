namespace Aether.Features.Login;

public partial class LoginPage : ContentPage
{
    public LoginPage()
    {
        InitializeComponent();
        BindingContext = new LoginViewModel();
        SetupAnimations();
        CustomizeEntryHandlers();
    }

    private static void CustomizeEntryHandlers()
    {
        // Remove the native Windows TextBox border so only the XAML Border wrapper is visible
#if WINDOWS
        Microsoft.Maui.Handlers.EntryHandler.Mapper.AppendToMapping("NoBorder", (handler, view) =>
        {
            if (handler.PlatformView is Microsoft.UI.Xaml.Controls.TextBox textBox)
            {
                textBox.BorderThickness = new Microsoft.UI.Xaml.Thickness(0);
                textBox.Padding = new Microsoft.UI.Xaml.Thickness(0);

                // Remove focus visual border too
                textBox.Resources["TextControlBorderThemeThicknessFocused"] = new Microsoft.UI.Xaml.Thickness(0);
                textBox.Resources["TextControlBorderThemeThickness"] = new Microsoft.UI.Xaml.Thickness(0);
            }
        });
        Microsoft.Maui.Handlers.EntryHandler.Mapper.AppendToMapping("TransparentBg", (handler, view) =>
        {
            if (handler.PlatformView is Microsoft.UI.Xaml.Controls.TextBox textBox)
            {
                textBox.Background = null;
                textBox.Resources["TextControlBackground"] = new Microsoft.UI.Xaml.Media.SolidColorBrush(Microsoft.UI.Colors.Transparent);
                textBox.Resources["TextControlBackgroundPointerOver"] = new Microsoft.UI.Xaml.Media.SolidColorBrush(Microsoft.UI.Colors.Transparent);
                textBox.Resources["TextControlBackgroundFocused"] = new Microsoft.UI.Xaml.Media.SolidColorBrush(Microsoft.UI.Colors.Transparent);
            }
        });
#endif
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

        // Hide any previous error/validation messages
        ErrorMessage.IsVisible = false;
        EmailValidationLabel.IsVisible = false;
        PasswordValidationLabel.IsVisible = false;

        // Per-field validation
        bool hasErrors = false;

        if (string.IsNullOrWhiteSpace(viewModel.Username) || (!string.IsNullOrWhiteSpace(viewModel.Username) && !viewModel.Username.Contains("@")))
        {
            EmailValidationLabel.IsVisible = true;
            hasErrors = true;
        }

        if (string.IsNullOrWhiteSpace(viewModel.Password) || viewModel.Password.Length < 8)
        {
            PasswordValidationLabel.IsVisible = true;
            hasErrors = true;
        }

        if (hasErrors)
        {
            // Shake animation for error
            await ShakeAnimationAsync(LoginButton);
            return;
        }

        // Show loading state
        LoginButton.IsLoading = true;

        // Validate against JSON credentials
        var isValid = await Services.AuthService.Instance.ValidateCredentialsAsync(
            viewModel.Username, viewModel.Password);

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

            await ShakeAnimationAsync(PasswordEntry);

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

    private static async Task ShakeAnimationAsync(VisualElement element)
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
        if (width < 400) MainContainer.Padding = new Thickness(16, 20, 16, 20);
    }
}
