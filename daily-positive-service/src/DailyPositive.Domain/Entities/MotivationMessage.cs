using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DailyPositive.Domain.Entities;

public class MotivationMessage
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("_id")]
    public string? IdMotivation {get; set;}

    [BsonElement("content")]
    public string Content {get; set;} = string.Empty;

    [BsonElement("author")]
    public string? Author {get; set;}

    [BsonElement("category")]
    public string Category {get; set;} = "general";

    [BsonElement("isActive")]
    public bool IsActive {get; set;} = true;

    [BsonElement("orderIndex")]
    public int OrderIndex{get;set;}

    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    
    public DateTime UpdateAt{get;set;} = DateTime.UtcNow;


}
