using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DailyPositive.Domain.Entities;

public class UserDailyMessage
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? IdUserDailyMg {get;set;}

    [BsonElement("userId")]
    public string UserId {get;set;} = string.Empty;

    [BsonElement("messageId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string MessageId {get;set;} = string.Empty;

    [BsonElement("assignedDate")]
    public DateTime AssignedDate {get;set;}

    [BsonElement("createdAt")]
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
}
