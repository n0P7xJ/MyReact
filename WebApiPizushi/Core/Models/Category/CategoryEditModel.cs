using Microsoft.AspNetCore.Http;

namespace Core.Models.Category;

public class CategoryEditModel
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;
    public IFormFile? ImageFile { get; set; } = null;
}
