package net.intelie.challenges.implementation;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import net.intelie.challenges.Event;
import net.intelie.challenges.EventIterator;
import net.intelie.challenges.EventStore;
import net.intelie.challenges.db.EventRepository;

public class EventStoreImpl implements EventStore {

	/**
     * Insert an event into ConcurrentHashMap memory repository, if the event just exists, then
     * calls recursively this same function and try again.
     */
	@Override
	public void insert(Event event) {
		if (EventRepository.events.putIfAbsent(event.key(), event) == null) {
			System.out.println("Successful event [" + event.type() + " - " + event.timestamp() + "] insertion.");
		} else {
			this.insert(event);
		}
	}

	/**
     * Remove all events presents in memory repository and in iterator list by its type.
     * This operation has been thread-safed, because the ConcurrentHashMap used in memory repository
     * is a thread-safe collection as we can see in [1]. It was chosed because it works with
     * "concurrent writer and reader threads" and provides "greater flexibility and higher scalability as 
     * it uses a special locking mechanism that enables multiple threads to read/update the map concurrently". [1]
     * 
     * [1] - https://www.codejava.net/java-core/concurrency/java-concurrent-collection-concurrenthashmap-examples
     */
	@Override
	public void removeAll(String type) {
		long count = 0L;
    	for (EventIterator it = this.query(type); it.moveNext(); ) {
    		EventRepository.events.remove(it.current().key());
    		it.remove();
            count++;
        }
    	System.out.println("All " + count + " " + type +" events have been successful removed!");
	}

	/**
     * List events by type, start time and end time.
     */
	@Override
	public EventIterator query(String type, long startTime, long endTime) {
		System.out.println("Executing a query...");
		List<Event> events = new ArrayList<Event>();
		EventIteratorImpl eventIteratorImpl = new EventIteratorImpl();
		eventIteratorImpl.it = listEvents(type, startTime, endTime).iterator();
		return eventIteratorImpl;
	}
	
	/**
     * Overload query method that list events just by type.
     */
	public EventIterator query(String type) {
		System.out.println("Executing a query...");
		EventIteratorImpl eventIteratorImpl = new EventIteratorImpl();
		eventIteratorImpl.it = listEvents(type).iterator();
		return eventIteratorImpl;
	}
	
	/**
     * List all events in memory repository using Java 8 Stram API.
     */
	public List<Event> listAllEvents() {
		return EventRepository.events.values().stream().map(event -> event).collect(Collectors.toList());
	}
	
	/**
     * Count all events in memory repository using Java 8 Stram API.
     */
	public long countEvents() {
		//return EventRepository.events.stream().count();
		return EventRepository.events.mappingCount();
	}
	
	/**
     * Auxiliary method to list events by type, startTime and endTime attributes, iterating
     * a concurrent hashmap by its keys and, forming a list of events to be manipulate.
     */
	private List<Event> listEvents(String type, long startTime, long endTime) {
		List<Event> events = new ArrayList<Event>();
		ConcurrentHashMap.KeySetView<String, Event> keySetView = EventRepository.events.keySet();
		Iterator<String> iterator = keySetView.iterator();
		while (iterator.hasNext()) {
			String key = iterator.next();
			Event event = EventRepository.events.get(key);
			if (isMatch(event, type)) {
				events.add(event);
			}
        }
		return events;
	}
	
	/**
     * Overload auxiliary method to list events by type.
     */
	private List<Event> listEvents(String type) {
		List<Event> events = new ArrayList<Event>();
		ConcurrentHashMap.KeySetView<String, Event> keySetView = EventRepository.events.keySet();
		Iterator<String> iterator = keySetView.iterator();
		while (iterator.hasNext()) {
			String key = iterator.next();
			Event event = EventRepository.events.get(key);
			if (isMatch(event, type)) {
				events.add(event);
			}
        }
		return events;
	}
	
	/**
     * Auxiliary method to match an event with type, startTime and endTime attributes by a condition.
     */
	private boolean isMatch(Event event, String type, long startTime, long endTime) {
		if (event.type().equals(type) && event.timestamp() >= startTime && event.timestamp() <= endTime ) {
			return true;
		}
		return false;
	}
	
	/**
     * Overload auxiliary method to match an event with type attribute by a condition.
     */
	private boolean isMatch(Event event, String type) {
		if (event.type().equals(type)) {
			return true;
		}
		return false;
	}
}
