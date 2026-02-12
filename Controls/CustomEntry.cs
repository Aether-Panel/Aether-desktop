namespace Aether.Controls;

partial class CustomEntry : Grid
{
    private Entry _entry;
    private Label _floatingLabel;
    private Label _icon;
    private Button _passwordToggle;
    private Grid _entryContainer;
    private bool _isPassword;
    private bool _isFloating;

    public static readonly BindableProperty TextProperty = BindableProperty.Create(nameof(Text), typeof(string), typeof(CustomEntry), string.Empty,
        propertyChanged: OnTextChanged);

    public static readonly BindableProperty PlaceholderProperty =
        BindableProperty.Create(nameof(Placeholder), typeof(string), typeof(CustomEntry), string.Empty);

    public static readonly BindableProperty IconProperty =
        BindableProperty.Create(nameof(Icon), typeof(string), typeof(CustomEntry), string.Empty);

    public static readonly BindableProperty IsPasswordProperty = BindableProperty.Create(nameof(IsPassword), typeof(bool), typeof(CustomEntry), false,
        propertyChanged: OnIsPasswordChanged);

    public static readonly BindableProperty KeyboardProperty = BindableProperty.Create(nameof(Keyboard), typeof(Keyboard), typeof(CustomEntry),
        Keyboard.Default);

    public string Text
    {
        get => (string)GetValue(TextProperty);
        set => SetValue(TextProperty, value);
    }

    public string Placeholder
    {
        get => (string)GetValue(PlaceholderProperty);
        set => SetValue(PlaceholderProperty, value);
    }

    public string Icon
    {
        get => (string)GetValue(IconProperty);
        set => SetValue(IconProperty, value);
    }

    public bool IsPassword
    {
        get => (bool)GetValue(IsPasswordProperty);
        set => SetValue(IsPasswordProperty, value);
    }

    public Keyboard Keyboard
    {
        get => (Keyboard)GetValue(KeyboardProperty);
        set => SetValue(KeyboardProperty, value);
    }

    public CustomEntry() => InitializeComponents();


    private void InitializeComponents()
    {
        RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
        RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });

        // Floating label
        _floatingLabel = new Label
        {
            Style = (Style)Application.Current.Resources["FloatingLabelStyle"],
            Text = Placeholder
        };

        Grid.SetRow(_floatingLabel, 0);

        // Entry container with icon and password toggle
        _entryContainer = new Grid
        {
            ColumnDefinitions =
                {
                    new ColumnDefinition { Width = GridLength.Auto },
                    new ColumnDefinition { Width = GridLength.Star },
                    new ColumnDefinition { Width = GridLength.Auto }
                }
        };

        // Icon
        _icon = new Label
        {
            Style = (Style)Application.Current.Resources["LoginIconStyle"],
            Text = Icon ?? "📝"
        };

        _entryContainer.Children.Add(_icon);
        Grid.SetColumn(_icon, 0);

        // Entry
        _entry = new Entry
        {
            Style = (Style)Application.Current.Resources["LoginEntryStyle"],
            Placeholder = string.Empty
        };

        _entry.Focused += Entry_Focused;
        _entry.Unfocused += Entry_Unfocused;
        _entry.TextChanged += Entry_TextChanged;
        _entryContainer.Children.Add(_entry);

        Grid.SetColumn(_entry, 1);

        // Password toggle
        _passwordToggle = new Button
        {
            Style = (Style)Application.Current.Resources["PasswordToggleStyle"],
            IsVisible = false
        };

        _passwordToggle.Clicked += PasswordToggle_Clicked;
        _entryContainer.Children.Add(_passwordToggle);
        Grid.SetColumn(_passwordToggle, 2);

        Grid.SetRow(_entryContainer, 1);
        Children.Add(_floatingLabel);
        Children.Add(_entryContainer);

        UpdateFloatingLabelPosition();
    }

    private static void OnTextChanged(BindableObject bindable, object oldValue, object newValue)
    {
        if (bindable is CustomEntry customEntry)
        {
            customEntry._entry.Text = (string)newValue;
            customEntry.UpdateFloatingLabelPosition();
        }
    }

    private static void OnIsPasswordChanged(BindableObject bindable, object oldValue, object newValue)
    {
        if (bindable is CustomEntry customEntry)
        {
            customEntry._isPassword = (bool)newValue;
            customEntry._passwordToggle.IsVisible = customEntry._isPassword;
            customEntry._entry.IsPassword = customEntry._isPassword;
        }
    }

    private void Entry_Focused(object sender, FocusEventArgs e)
    {
        _isFloating = true;

        UpdateFloatingLabelPosition();
        AnimateFloatingLabel(true);
    }

    private void Entry_Unfocused(object sender, FocusEventArgs e)
    {
        if (string.IsNullOrEmpty(_entry.Text))
            _isFloating = false;

        UpdateFloatingLabelPosition();
        AnimateFloatingLabel(false);
    }

    private void Entry_TextChanged(object sender, TextChangedEventArgs e)
    {
        Text = e.NewTextValue;
        UpdateFloatingLabelPosition();
    }

    private void PasswordToggle_Clicked(object sender, EventArgs e)
    {
        _entry.IsPassword = !_entry.IsPassword;
        _passwordToggle.Text = _entry.IsPassword ? "👁" : "👁‍🗨";
    }

    private void UpdateFloatingLabelPosition()
    {
        if (_isFloating || !string.IsNullOrEmpty(_entry.Text))
        {
            _floatingLabel.Scale = 0.85;
            _floatingLabel.Margin = new Thickness(0, -8, 0, 0);
            _floatingLabel.TranslationX = -8;
        }
        else
        {
            _floatingLabel.Scale = 1.0;
            _floatingLabel.Margin = new Thickness(0, 8, 0, 0);
            _floatingLabel.TranslationX = 0;
        }
    }

    private void AnimateFloatingLabel(bool show)
    {
        var scale = show ? 0.85 : 1.0;
        var translationX = show ? -8 : 0;
        var margin = show ? new Thickness(0, -8, 0, 0) : new Thickness(0, 8, 0, 0);

        _floatingLabel.Animate("FloatingLabelAnimation", v =>
        {
            _floatingLabel.Scale = scale;
            _floatingLabel.TranslationX = translationX;
            _floatingLabel.Margin = margin;
        }, 16, 200, Easing.SinOut);
    }

    protected override void OnBindingContextChanged()
    {
        base.OnBindingContextChanged();
        _entry.BindingContext = BindingContext;
        ApplyTemplateChanges();
    }

    private void ApplyTemplateChanges()
    {
        // Apply dynamic property changes
        _entry.Text = Text;
        _entry.Keyboard = Keyboard;
        _entry.IsPassword = IsPassword;
        _icon.Text = Icon ?? "📝";
        _floatingLabel.Text = Placeholder;
    }

    public new void Focus() => _entry.Focus();


    public new void Unfocus() => _entry.Unfocus();

}
