using Aether.Helpers;

namespace Aether.Features.Register;

public partial class RegisterPage : ContentPage
{
    private readonly RegisterViewModel _viewModel;

    public RegisterPage()
    {
        InitializeComponent();
        _viewModel = new RegisterViewModel();
        BindingContext = _viewModel;
        SetupAnimations();
    }

    private void SetupAnimations()
    {
        RegisterContent.Opacity = 0;
        TitleLabel.TranslationY = -20;
        FormSection.TranslationY = 20;
        ButtonSection.TranslationY = 20;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        await Task.WhenAll(
            RegisterContent.FadeToAsync(1, 200, Easing.SinOut),
            TitleLabel.TranslateToAsync(0, 0, 300, Easing.SinOut),
            FormSection.TranslateToAsync(0, 0, 350, Easing.SinOut),
            ButtonSection.TranslateToAsync(0, 0, 400, Easing.SinOut)
        );
    }

    private async void OnRegisterButtonClicked(object sender, EventArgs e)
    {
        // Hide error message initially
        _viewModel.ErrorMessage = string.Empty;

        RegisterButton.IsLoading = true;
        await _viewModel.RegisterAsync();
        RegisterButton.IsLoading = false;

        // Shake if error
        if (!string.IsNullOrEmpty(_viewModel.ErrorMessage)) await RegisterButton.ShakeAsync();

    }

    private async void OnBackButtonClicked(object sender, EventArgs e) => await Shell.Current.GoToAsync("//LoginPage");

    private void OnPasswordToggleClicked(object sender, EventArgs e)
    {
        PasswordEntry.IsPassword = !PasswordEntry.IsPassword;
        var button = (Button)sender;
        button.Text = PasswordEntry.IsPassword ? "👁" : "👁‍🗨";
    }

    private void OnConfirmPasswordToggleClicked(object sender, EventArgs e)
    {
        ConfirmPasswordEntry.IsPassword = !ConfirmPasswordEntry.IsPassword;
        var button = (Button)sender;
        button.Text = ConfirmPasswordEntry.IsPassword ? "👁" : "👁‍🗨";
    }
}
