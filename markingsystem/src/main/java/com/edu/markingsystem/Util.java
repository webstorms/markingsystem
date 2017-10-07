package com.edu.markingsystem;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.internal.Primitives;

public class Util {

	private static final Gson parser = new Gson();
	
	public static <T> T fromJson(String json, Class<T> classOfT) {
	    Object object = parser.fromJson(json, (Type) classOfT);
	    return Primitives.wrap(classOfT).cast(object);
	}
	
	public static String objectToJson(Object src) {
		return parser.toJson(src);
		
	}
	
	public static JsonObject stringToJson(String json) {
		JsonElement element = parser.fromJson(json, JsonElement.class);
		return element.getAsJsonObject();
		
	}
	
	public static JsonArray stringToJsonArray(String json) {
		JsonElement element = parser.fromJson(json, JsonElement.class);
		return element.getAsJsonArray();
		
	}
	
	public static <T> List<T> toList(JsonArray arr, Class<T> classOfT) {
		List<T> list = new ArrayList<T>();
		for(int i = 0; i < arr.size(); i++) {
			list.add(fromJson(arr.get(i).getAsString(), classOfT));
			
		}
		
		return list;
		
	}
	
	
}