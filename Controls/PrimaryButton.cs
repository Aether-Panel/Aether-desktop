using Microsoft.Maui.Controls;

namespace Aether.Controls
{
    public class PrimaryButton : Button
    {
        public static readonly BindableProperty IsLoadingProperty =
            BindableProperty.Create(nameof(IsLoading), typeof(bool), typeof(PrimaryButton), false,
                propertyChanged: OnIsLoadingChanged);

        public bool IsLoading
        {
            get => (bool)GetValue(IsLoadingProperty);
            set => SetValue(IsLoadingProperty, value);
        }

        public PrimaryButton()
        {
            Style = (Style)Application.Current.Resources["LoginPrimaryButtonStyle"];
            this.SetDynamicResource(Button.StyleProperty, "LoginPrimaryButtonStyle");
            
            // Add animations
            this.Clicked += PrimaryButton_Clicked;
        }

        private static void OnIsLoadingChanged(BindableObject bindable, object oldValue, object newValue)
        {
            if (bindable is PrimaryButton button)
            {
                button.UpdateLoadingState((bool)newValue);
            }
        }

        private void UpdateLoadingState(bool isLoading)
        {
            if (isLoading)
            {
                this.IsEnabled = false;
                this.Opacity = 0.7;
                
                // Add loading animation
                var loadingAnimation = new Animation();
                loadingAnimation.Add(0, 1, new Animation(v => this.Rotation = v, 0, 360));
                loadingAnimation.Commit(this, "LoadingAnimation", 16, 2000, Easing.Linear, null, () => true);
            }
            else
            {
                this.IsEnabled = true;
                this.Opacity = 1.0;
                
                // Remove loading animation
                this.AbortAnimation("LoadingAnimation");
                this.Rotation = 0;
            }
        }

        private async void PrimaryButton_Clicked(object sender, EventArgs e)
        {
            // Add click animation
            await this.ScaleToAsync(0.95, 100, Easing.SinOut);
            await this.ScaleToAsync(1.0, 100, Easing.SinIn);
        }

        protected override void OnSizeAllocated(double width, double height)
        {
            base.OnSizeAllocated(width, height);
            
            // Ensure consistent width
            if (width > 0 && this.WidthRequest == -1)
            {
                this.WidthRequest = Math.Min(width, 400);
            }
        }
    }

    public class SecondaryButton : Button
    {
        public SecondaryButton()
        {
            Style = (Style)Application.Current.Resources["LoginSecondaryButtonStyle"];
            this.SetDynamicResource(Button.StyleProperty, "LoginSecondaryButtonStyle");
            
            // Add animations
            this.Clicked += SecondaryButton_Clicked;
        }

        private async void SecondaryButton_Clicked(object sender, EventArgs e)
        {
            // Add click animation
            await this.ScaleToAsync(0.95, 100, Easing.SinOut);
            await this.ScaleToAsync(1.0, 100, Easing.SinIn);
        }
    }
}