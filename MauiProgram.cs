using Microsoft.Extensions.Logging;

namespace Aether;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

		CustomizeEntryHandlers();

#if DEBUG
		builder.Logging.AddDebug();
#endif

		return builder.Build();
	}

	private static void CustomizeEntryHandlers()
	{
#if WINDOWS
		// Remove the native Windows TextBox border so only the XAML Border wrapper is visible
		Microsoft.Maui.Handlers.EntryHandler.Mapper.AppendToMapping("NoBorder", (handler, view) =>
		{
			if (handler.PlatformView is Microsoft.UI.Xaml.Controls.TextBox textBox)
			{
				textBox.BorderThickness = new Microsoft.UI.Xaml.Thickness(0);
				textBox.Padding = new Microsoft.UI.Xaml.Thickness(0);
				textBox.Resources["TextControlBorderThemeThicknessFocused"] = new Microsoft.UI.Xaml.Thickness(0);
				textBox.Resources["TextControlBorderThemeThickness"] = new Microsoft.UI.Xaml.Thickness(0);
			}
		});
		Microsoft.Maui.Handlers.EntryHandler.Mapper.AppendToMapping("TransparentBg", (handler, view) =>
		{
			if (handler.PlatformView is Microsoft.UI.Xaml.Controls.TextBox textBox)
			{
				textBox.Background = null;
				textBox.Resources["TextControlBackground"] = new Microsoft.UI.Xaml.Media.SolidColorBrush(Microsoft.UI.Colors.Transparent);
				textBox.Resources["TextControlBackgroundPointerOver"] = new Microsoft.UI.Xaml.Media.SolidColorBrush(Microsoft.UI.Colors.Transparent);
				textBox.Resources["TextControlBackgroundFocused"] = new Microsoft.UI.Xaml.Media.SolidColorBrush(Microsoft.UI.Colors.Transparent);
			}
		});
#endif
	}
}
