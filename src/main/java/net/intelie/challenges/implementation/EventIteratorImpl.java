package net.intelie.challenges.implementation;

import java.util.Iterator;

import net.intelie.challenges.Event;
import net.intelie.challenges.EventIterator;

/**
 * Class that implements the EventIterator. This class handle the events that listed
 * by queries, but not execute the actions * in the memory repository.
 */
public class EventIteratorImpl implements EventIterator {
	
	public Iterator<Event> it;

	@Override
	public void close() throws Exception {
		this.it = null;
	}

	@Override
	public boolean moveNext() {
		return this.it.hasNext();
	}

	@Override
	public Event current() {
		try {
			return this.it.next();
		} catch (Exception e) {
			throw new IllegalStateException("Current event not found");
		}
		
	}

	@Override
	public void remove() {
		try {
			this.it.remove();
		} catch (Exception e) {
			throw new IllegalStateException("Current event not found");
		}
	}
}
