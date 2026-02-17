
using Aether.Helpers;

namespace Aether.Controls;

partial class SecondaryButton : Button
{
    public SecondaryButton()
    {
        Style = (Style)Application.Current.Resources["LoginSecondaryButtonStyle"];
        SetDynamicResource(StyleProperty, "LoginSecondaryButtonStyle");

        Clicked += async (s, e) => await this.PressAsync();
    }
}
