package net.intelie.challenges;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import net.intelie.challenges.implementation.EventIteratorImpl;

public class EventIteratorImplTest {
	
	@Test
    public void testMoveNextEvent() throws Exception {
        Event event = new Event("some_type", 123L);
        
        List<Event> events = new ArrayList<Event>();
        events.add(event);
        
        EventIteratorImpl eventIteratorImpl = new EventIteratorImpl();
        eventIteratorImpl.it = events.iterator();
    	
        assert(eventIteratorImpl.moveNext());
    }
	
	@Test
    public void testGetCurrentEvent() throws Exception {
        Event event = new Event("some_type", 123L);
        
        List<Event> events = new ArrayList<Event>();
        events.add(event);
        
        EventIteratorImpl eventIteratorImpl = new EventIteratorImpl();
        eventIteratorImpl.it = events.iterator();
        
        Event e = eventIteratorImpl.current();
    	
        assertNotNull(e);
    }
	
    @Test
    public void testRemoveingEvent() throws Exception {
        Event event = new Event("some_type", 123L);
        
        List<Event> events = new ArrayList<Event>();
        events.add(event);
        
        EventIteratorImpl eventIteratorImpl = new EventIteratorImpl();
        eventIteratorImpl.it = events.iterator();
        
        int count = 1;
        
    	for (EventIteratorImpl it = eventIteratorImpl; it.moveNext(); ) {
    		it.current();
    		it.remove();
    		count--;
        }
    	
        assertEquals(0, count);
    }
}