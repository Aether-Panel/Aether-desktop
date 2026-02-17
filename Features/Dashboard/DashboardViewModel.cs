using Aether.Features.Servers;

namespace Aether.Features.Dashboard;

partial class DashboardViewModel : BindableObject
{
    private bool _isSidebarExpanded = true;
    private object _currentView;
    private string _currentTitle = "Mis Servidores";
    private bool _isLogoutModalVisible;

    // View Instances
    public ServersView ServersView { get; private set; }
    public ContentView UptimeView { get; private set; } // Placeholder
    public ContentView AdminView { get; private set; } // Placeholder

    public bool IsSidebarExpanded
    {
        get => _isSidebarExpanded;
        set
        {
            _isSidebarExpanded = value;
            OnPropertyChanged(nameof(IsSidebarExpanded));
            OnPropertyChanged(nameof(SidebarWidth));
            OnPropertyChanged(nameof(SidebarButtonIcon));
        }
    }

    public GridLength SidebarWidth
    {
        get
        {
            bool isPhone = DeviceInfo.Idiom == DeviceIdiom.Phone;
            double expanded = isPhone ? 200 : 250;
            double collapsed = isPhone ? 60 : 70;
            return IsSidebarExpanded ? new GridLength(expanded) : new GridLength(collapsed);
        }
    }

    // Keep instance-bound so bindings update when the sidebar state changes.
    public string SidebarButtonIcon => IsSidebarExpanded ? "menu.png" : "menu.png";

    public object CurrentView
    {
        get => _currentView;
        set
        {
            _currentView = value;
            OnPropertyChanged(nameof(CurrentView));
        }
    }

    public string CurrentTitle
    {
        get => _currentTitle;
        set
        {
            _currentTitle = value;
            OnPropertyChanged(nameof(CurrentTitle));
        }
    }

    public bool IsLogoutModalVisible
    {
        get => _isLogoutModalVisible;
        set
        {
            _isLogoutModalVisible = value;
            OnPropertyChanged(nameof(IsLogoutModalVisible));
        }
    }

    // Commands
    public Command ToggleSidebarCommand { get; }
    public Command NavigateCommand { get; }
    public Command LogoutCommand { get; }
    public Command ConfirmLogoutCommand { get; }
    public Command CancelLogoutCommand { get; }

    public DashboardViewModel()
    {
        _isSidebarExpanded = DeviceInfo.Idiom != DeviceIdiom.Phone;

        // Initialize Views
        ServersView = new ServersView();
        UptimeView = new ContentView { Content = new Label { Text = "Uptime Monitor (Próximamente)", VerticalOptions = LayoutOptions.Center, HorizontalOptions = LayoutOptions.Center } };
        AdminView = new ContentView { Content = new Label { Text = "Administración (Próximamente)", VerticalOptions = LayoutOptions.Center, HorizontalOptions = LayoutOptions.Center } };

        // Default View
        CurrentView = ServersView;

        ToggleSidebarCommand = new Command(() => IsSidebarExpanded = !IsSidebarExpanded);

        NavigateCommand = new Command<string>(OnNavigate);
        LogoutCommand = new Command(ShowLogoutModal);
        ConfirmLogoutCommand = new Command(OnConfirmLogout);
        CancelLogoutCommand = new Command(HideLogoutModal);
    }

    private void OnNavigate(string destination)
    {
        (CurrentView, CurrentTitle) = destination switch
        {
            "Servers" => (ServersView, "Mis Servidores"),
            "Uptime" => (UptimeView, "Uptime"),
            "Admin" => (AdminView, "Administración"),
            _ => (CurrentView, CurrentTitle)
        };
    }

    private void ShowLogoutModal() => IsLogoutModalVisible = true;

    private void HideLogoutModal() => IsLogoutModalVisible = false;

    private async void OnConfirmLogout()
    {
        IsLogoutModalVisible = false;
        Services.AuthService.Instance.Logout();
        await Shell.Current.GoToAsync("//LoginPage", true);
    }
}
