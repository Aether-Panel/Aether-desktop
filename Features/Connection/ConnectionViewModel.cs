namespace Aether.Features.Connection;

public class ConnectionViewModel : BindableObject
{
    private string _host;
    private string _port;
    private bool _isLoading;
    private string _errorMessage;

    public string Host
    {
        get => _host;
        set
        {
            _host = value;
            OnPropertyChanged(nameof(Host));
        }
    }

    public string Port
    {
        get => _port;
        set
        {
            _port = value;
            OnPropertyChanged(nameof(Port));
        }
    }

    public bool IsLoading
    {
        get => _isLoading;
        set
        {
            _isLoading = value;
            OnPropertyChanged(nameof(IsLoading));
        }
    }

    public string ErrorMessage
    {
        get => _errorMessage;
        set
        {
            _errorMessage = value;
            OnPropertyChanged(nameof(ErrorMessage));
        }
    }

    public async Task ConnectAsync()
    {
        if (IsLoading) return;

        IsLoading = true;
        ErrorMessage = string.Empty;

        try
        {
            if (string.IsNullOrWhiteSpace(Host))
            {
                ErrorMessage = "El Host o IP es requerido.";
                IsLoading = false;
                return;
            }

            // Simple validation logic
            string baseUrl;
            if (string.IsNullOrWhiteSpace(Port))
            {
                baseUrl = Host.StartsWith("http") ? Host : $"https://{Host}";
            }
            else
            {
                // If port is specified, assume http unless specified otherwise, or handle logic
                var protocol = Host.StartsWith("http") ? "" : "http://";
                baseUrl = $"{protocol}{Host}:{Port}";
            }

            // Save preference
            Preferences.Default.Set("BackendUrl", baseUrl);

            // Simulate connection check
            await Task.Delay(1000);

            // Navigate to Login
            await Shell.Current.GoToAsync("//LoginPage");
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }
}
