
namespace Aether.Controls;

partial class PrimaryButton : Button
{
    public static readonly BindableProperty IsLoadingProperty = BindableProperty.Create(nameof(IsLoading), typeof(bool), typeof(PrimaryButton), false,
        propertyChanged: OnIsLoadingChanged);

    public bool IsLoading
    {
        get => (bool)GetValue(IsLoadingProperty);
        set => SetValue(IsLoadingProperty, value);
    }

    public PrimaryButton()
    {
        Style = (Style)Application.Current.Resources["LoginPrimaryButtonStyle"];
        SetDynamicResource(StyleProperty, "LoginPrimaryButtonStyle");

        // Add animations
        Clicked += PrimaryButton_ClickedAsync;
    }

    private static void OnIsLoadingChanged(BindableObject bindable, object oldValue, object newValue)
    {
        if (bindable is PrimaryButton button) button.UpdateLoadingState((bool)newValue);
    }

    private void UpdateLoadingState(bool isLoading)
    {
        if (isLoading)
        {
            IsEnabled = false;
            Opacity = 0.7;

            // Add loading animation
            var loadingAnimation = new Animation();
            loadingAnimation.Add(0, 1, new Animation(v => Rotation = v, 0, 360));
            loadingAnimation.Commit(this, "LoadingAnimation", 16, 2000, Easing.Linear, null, () => true);
        }
        else
        {
            IsEnabled = true;
            Opacity = 1.0;

            // Remove loading animation
            this.AbortAnimation("LoadingAnimation");
            Rotation = 0;
        }
    }

    private async void PrimaryButton_ClickedAsync(object sender, EventArgs e)
    {
        // Add click animation
        await this.ScaleToAsync(0.95, 100, Easing.SinOut);
        await this.ScaleToAsync(1.0, 100, Easing.SinIn);
    }

    protected override void OnSizeAllocated(double width, double height)
    {
        base.OnSizeAllocated(width, height);

        // Ensure consistent width
        if (width > 0 && WidthRequest == -1) WidthRequest = Math.Min(width, 400);

    }
}

partial class SecondaryButton : Button
{
    public SecondaryButton()
    {
        Style = (Style)Application.Current.Resources["LoginSecondaryButtonStyle"];
        SetDynamicResource(StyleProperty, "LoginSecondaryButtonStyle");

        // Add animations
        Clicked += SecondaryButton_ClickedAsync;
    }

    private async void SecondaryButton_ClickedAsync(object sender, EventArgs e)
    {
        // Add click animation
        await this.ScaleToAsync(0.95, 100, Easing.SinOut);
        await this.ScaleToAsync(1.0, 100, Easing.SinIn);
    }
}
