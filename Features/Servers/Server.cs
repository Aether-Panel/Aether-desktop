namespace Aether.Features.Servers;

public class Server
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; } // e.g., Minecraft, Web, Bot
    public string Address { get; set; } // IP:Port
    public string Node { get; set; }
    public string Status { get; set; } // Online, Offline
    public string Icon { get; set; } // Placeholder for icon
}
