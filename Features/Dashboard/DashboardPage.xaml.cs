namespace Aether.Features.Dashboard;

public partial class DashboardPage : ContentPage
{
    public DashboardPage()
    {
        InitializeComponent();
        BindingContext = new DashboardViewModel();
    }



    private async void OnMenuClickedAsync(object sender, EventArgs e)
    {
        if (sender is not ImageButton button) return;

        // is an animation when you click on the menu icon
        await button.ScaleToAsync(0.9, 80, Easing.CubicOut);
        await button.ScaleToAsync(1, 120, Easing.CubicOut);
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        // Auth guard: redirect to login if not authenticated
        if (!Services.AuthService.Instance.IsAuthenticated) await Shell.Current.GoToAsync("//LoginPage");

    }
}
