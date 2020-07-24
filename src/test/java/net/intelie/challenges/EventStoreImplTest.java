package net.intelie.challenges;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import net.intelie.challenges.db.EventRepository;
import net.intelie.challenges.implementation.EventStoreImpl;

public class EventStoreImplTest {
	@Test
    public void testInsertingOneEvent() throws Exception {
		EventStoreImpl eventStoreImpl = new EventStoreImpl();
		eventStoreImpl.insert(new Event("some_type", 1000000000000L));
		
		Event event = eventStoreImpl.query("some_type").current();
		assertNotNull(event);
    }
	
	@Test
    public void testInsertingManyEvent() throws Exception {
		EventStoreImpl eventStoreImpl = new EventStoreImpl();
		
		for (int i = 0; i < 9; i++) {
			eventStoreImpl.insert(new Event("some_type", 1000000000001L + i));
		}
		
		int count = 0;
		for (EventIterator it = eventStoreImpl.query("some_type"); it.moveNext(); ) {
    		it.current();
            count++;
        }
		
		assertEquals(10, count + 1);
    }
    
    @Test
    public void testGettingAllEventsWithQueryByType() throws Exception {
    	EventStoreImpl eventStoreImpl = new EventStoreImpl();
                        
        int count = 0;
		for (EventIterator it = eventStoreImpl.query("some_type"); it.moveNext(); ) {
			it.current();
            count++;
        }

        assertEquals(10, count + 1);
    }
    
    @Test
    public void testGettingAllEventsWithQueryByTypeAndTimeRange() throws Exception {
    	EventStoreImpl eventStoreImpl = new EventStoreImpl();
                        
        int count = 0;
		for (EventIterator it = eventStoreImpl.query("some_type", 1000000000000L, 1000000000004L); it.moveNext(); ) {
    		//EventRepository.events.remove(it.current());
			it.current();
            count++;
        }
        
		assertEquals(5, count + 1);
    }
    
    @Test
    public void testListAllEvents() throws Exception {
    	EventStoreImpl eventStoreImpl = new EventStoreImpl();
    	List<Event> events = eventStoreImpl.listAllEvents();
    	    	
    	assertEquals(10L, events.stream().count());
    }
    
    @Test
    public void testCountEvents() throws Exception {
    	EventStoreImpl eventStoreImpl = new EventStoreImpl();
    	long count = eventStoreImpl.countEvents();
    	
    	assertEquals(10L, count);
    }
    
    /*
    @Test
    public void testRemoveingAllEvents() throws Exception {
    	EventStoreImpl eventStoreImpl = new EventStoreImpl();
                
        Thread thread = new Thread(() -> {
        	eventStoreImpl.removeAll("some_type");
        });
        thread.start();
    }
    */
}

