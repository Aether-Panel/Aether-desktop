namespace Aether.Helpers;

public static class AnimationExtensions
{
    /// <summary>
    /// Plays a horizontal shake animation on the element to indicate an error.
    /// </summary>
    public static async Task ShakeAsync(this VisualElement element)
    {
        await element.TranslateToAsync(-10, 0, 50, Easing.SinOut);
        await element.TranslateToAsync(10, 0, 50, Easing.SinOut);
        await element.TranslateToAsync(-10, 0, 50, Easing.SinOut);
        await element.TranslateToAsync(10, 0, 50, Easing.SinOut);
        await element.TranslateToAsync(0, 0, 50, Easing.SinOut);
    }

    /// <summary>
    /// Plays a subtle press/release scale animation for button feedback.
    /// </summary>
    public static async Task PressAsync(this VisualElement element)
    {
        await element.ScaleToAsync(0.95, 100, Easing.SinOut);
        await element.ScaleToAsync(1.0, 100, Easing.SinIn);
    }
}
