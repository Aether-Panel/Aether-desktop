namespace Aether.Features.Connection;

public partial class ConnectionPage : ContentPage
{
    private readonly ConnectionViewModel _viewModel;

    public ConnectionPage()
    {
        InitializeComponent();
        _viewModel = new ConnectionViewModel();
        BindingContext = _viewModel;
        
        // Cargar datos previos si existen
        if (Preferences.Default.ContainsKey("BackendUrl"))
        {
            var url = Preferences.Default.Get("BackendUrl", string.Empty);
            // Simple parsing logic strictly for display restoration
            if (!string.IsNullOrEmpty(url))
            {
               // Lógica muy básica para separar, puede mejorarse
               Uri uri;
               if (Uri.TryCreate(url, UriKind.Absolute, out uri))
               {
                   _viewModel.Host = uri.Host;
                   _viewModel.Port = uri.Port == 80 || uri.Port == 443 ? "" : uri.Port.ToString();
               }
               else
               {
                   _viewModel.Host = url;
               }
            }
        }

        SetupAnimations();
    }

    private void SetupAnimations()
    {
        ConnectionContent.Opacity = 0;
        TitleLabel.TranslationY = -20;
        FormSection.TranslationY = 20;
        ButtonSection.TranslationY = 20;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        await Task.WhenAll(
            ConnectionContent.FadeToAsync(1, 200, Easing.SinOut),
            TitleLabel.TranslateToAsync(0, 0, 300, Easing.SinOut),
            FormSection.TranslateToAsync(0, 0, 350, Easing.SinOut),
            ButtonSection.TranslateToAsync(0, 0, 400, Easing.SinOut)
        );
    }

    private async void OnConnectClicked(object sender, EventArgs e)
    {
        // Trigger ViewModel logic
        ConnectButton.IsLoading = true;
        await _viewModel.ConnectAsync();
        ConnectButton.IsLoading = false;
    }
}
