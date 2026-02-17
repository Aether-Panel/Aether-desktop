using System.Text.Json;

namespace Aether.Services;

public class AuthService
{
    private static AuthService _instance;
    public static AuthService Instance => _instance ??= new AuthService();

    public bool IsAuthenticated { get; private set; }
    public string CurrentUserName { get; private set; }
    public string CurrentUserRole { get; private set; }

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private List<UserCredential> _users = [];

    private AuthService() { }

    public async Task LoadCredentialsAsync()
    {
        if (_users.Count > 0) return;

        try
        {
            using var stream = await FileSystem.OpenAppPackageFileAsync("appsettings.Development.json");
            using var reader = new StreamReader(stream);
            var json = await reader.ReadToEndAsync();

            var config = JsonSerializer.Deserialize<CredentialsConfig>(json, _jsonOptions);

            if (config?.Users is not null) _users = config.Users;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error loading credentials: {ex.Message}");
        }
    }

    public async Task<bool> ValidateCredentialsAsync(string username, string password)
    {
        await LoadCredentialsAsync();

        var user = _users.FirstOrDefault(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase) && u.Password == password);

        if (user is not null)
        {
            IsAuthenticated = true;
            CurrentUserName = user.DisplayName;
            CurrentUserRole = user.Role;
            return true;
        }

        return false;
    }

    public void Logout()
    {
        IsAuthenticated = false;
        CurrentUserName = null;
        CurrentUserRole = null;
    }
}
