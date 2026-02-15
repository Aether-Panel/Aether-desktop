using System.Collections.ObjectModel;

namespace Aether.Features.Servers;

partial class ServersViewModel : BindableObject
{
    private ObservableCollection<Server> _servers;
    private bool _isLoading;

    public ObservableCollection<Server> Servers
    {
        get => _servers;
        set
        {
            _servers = value;
            OnPropertyChanged(nameof(Servers));
        }
    }

    public bool IsLoading
    {
        get => _isLoading;
        set
        {
            _isLoading = value;
            OnPropertyChanged(nameof(IsLoading));
        }
    }

    public ServersViewModel()
    {
        Servers = [];
        LoadServers();
    }

    private async void LoadServers()
    {
        IsLoading = true;
        // Simulate network delay
        await Task.Delay(1000);

        // Mock Data
        Servers =
        [
            new()
            {
                Id = "1",
                Name = "Survival SMP",
                Type = "Minecraft",
                Address = "192.168.1.50:25565",
                Node = "Node-01",
                Status = "Online",
                Icon = "🎮"
            },
            new()
            {
                Id = "2",
                Name = "Bot Discord",
                Type = "NodeJS",
                Address = "192.168.1.50:3000",
                Node = "Node-02",
                Status = "Online",
                Icon = "🤖"
            },
            new()
            {
                Id = "3",
                Name = "Web Panel",
                Type = "Nginx",
                Address = "192.168.1.50:80",
                Node = "Node-01",
                Status = "Offline",
                Icon = "🌐"
            },
            new()
            {
                Id = "4",
                Name = "Creative Plot",
                Type = "Minecraft",
                Address = "192.168.1.50:25566",
                Node = "Node-03",
                Status = "Online",
                Icon = "🏰"
            }
        ];


        IsLoading = false;
    }
}
