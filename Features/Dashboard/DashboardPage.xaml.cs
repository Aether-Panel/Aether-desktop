namespace Aether.Features.Dashboard;

public partial class DashboardPage : ContentPage
{
	public DashboardPage()
	{
		InitializeComponent();
        BindingContext = new DashboardViewModel();
	}

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        // Auth guard: redirect to login if not authenticated
        if (!Services.AuthService.Instance.IsAuthenticated)
        {
            await Shell.Current.GoToAsync("//LoginPage");
        }
    }
}
