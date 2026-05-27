using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MudBlazor.Services;
using NotiesBlazor.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add MudBlazor Services
builder.Services.AddMudServices();

// Add Controller as singleton/scoped to handle clean JSON flat-file read/writes
builder.Services.AddSingleton<UserController>();

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
