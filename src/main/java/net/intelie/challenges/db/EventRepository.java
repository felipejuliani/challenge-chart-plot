package net.intelie.challenges.db;

import java.util.concurrent.ConcurrentHashMap;

import net.intelie.challenges.Event;


/**
 * Class that represents the global memory repository accessed by other layers to handle event data.
 */
public class EventRepository {
	public static ConcurrentHashMap<String, Event> events;
}
