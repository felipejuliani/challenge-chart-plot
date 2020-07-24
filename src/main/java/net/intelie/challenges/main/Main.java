package net.intelie.challenges.main;

import java.time.Instant;
import java.util.Random;
import java.util.Scanner;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

import net.intelie.challenges.Event;
import net.intelie.challenges.EventIterator;
import net.intelie.challenges.db.EventRepository;
import net.intelie.challenges.implementation.EventStoreImpl;

/**
 * Executable class created to perform the challenge and enable functional tests by an end-user.
 */
public class Main {
	
	/**
	 * Executable method that show a menu to user execute actions.
	 * User can type:
	 * 	- an integer number to insert in memory repository an amount of randomized type events; 
	 *  - "list" to list all events in memory repository;
	 *  - "count" to count all events in memory repository;
	 *  - "query" to detail a query command typing:
	 *      - "list <event_type>" to list all event by event type;
	 *      - "list <event_type> <start_time> <end_time>" to list all events by type and timestamp interval;
	 *      - "remove-all <event_type>" to remove all occurrences of events by type; and
	 *      - "remove-all <event_type> <start_time> <end_time>" to remove all occurrences of events by type, and timestamp interval;
	 *  - "exit" to close application.
	 */
	public static void main(String[] args) {
		EventRepository.events = new ConcurrentHashMap<String, Event>();
				
		EventStoreImpl eventStoreImpl = new EventStoreImpl();
		
		String choice;
		choice = menu();

        while (!choice.equals("exit")) {        	
    		if (isNumber(choice)) {
    			setEventRepository(eventStoreImpl, Long.parseLong(choice));
    		} else if (choice.equals("list")) {
    			eventStoreImpl.listAllEvents().stream().forEach(event -> System.out.println(event.type() + " - " + event.timestamp()));
    		} else if (choice.equals("count")) {
    			System.out.println("Events sum: " + eventStoreImpl.countEvents());
    		} else if (choice.equals("query")) {
            	String query = query();
            	String result[] = query.split(" ");
            	
            	if (result.length == 2) {
            		if (result[0].equals("list")) {
    	            	EventIterator eventIterator = eventStoreImpl.query(result[1]);
    	            	executeIteractor(eventIterator, result[1]);
                	} else if (result[0].equals("remove-all")) {
                       	eventStoreImpl.removeAll(result[1]);
                	} else {
                		System.out.println("Command could not be interpreted.");
                	}
            	} else if (result.length == 4) {
            		if (result[0].equals("list")) {
    	            	EventIterator eventIterator = eventStoreImpl.query(result[1], Long.parseLong(result[2]), Long.parseLong(result[3]));
    	            	executeIteractor(eventIterator, result[1]);
                	} else {
                		System.out.println("Command could not be interpreted.");
                	}
            	}
			} else {
            	System.out.println("Wrong choice. Please, try again.");	
    		}
        	
        	choice = menu();
        }
	}
	
	
	/**
	 * From here to the end the auxiliary methods were written to set command line menus, set 
	 * memory repository of random events, as well a method to verify the type of text insertion. 
	 */
	private static void executeIteractor(EventIterator eventIterator, String type) {
		long count = 0L;
    	for (EventIterator it = eventIterator; it.moveNext(); ) {
            Event event = it.current();
            System.out.println(event.type() + " - " + event.timestamp());
            count++;
        }
    	System.out.println("-------------------------------------------------------");
    	System.out.println(type + " events sum: " + count + "\n\n");
	}
	
	private static String menu() {
        String selection;
        Scanner input = new Scanner(System.in);

        System.out.println("Type a number to insert a random events amount or type 'query' or 'list' or 'count'");
        System.out.println("-----------------------------------------------------------------------------------");
        System.out.println(": ");

        selection = input.nextLine();
        return selection;    
    }
	
	private static String query() {
		String query;
        Scanner input = new Scanner(System.in);
        
        System.out.println("Now type: ['list' or 'remove-all'] ['start', 'span', 'data', 'stop'] [an initial timestamp](optional) [a final timestamp](optional)");
        System.out.println("-----------------------------------------------------------------------------------------------------------------------------------");
        System.out.print(": ");
        
        query = input.nextLine();
		return query;
	}
	
	private static void setEventRepository(EventStoreImpl eventStoreImpl, long amount) {	
		for (int i = 0; i < amount; i++) {
			Random type = new Random();
			int value = type.nextInt(4);
			
			switch (value) {
	            case 0:
            		eventStoreImpl.insert(new Event("start", Instant.now().toEpochMilli()));
	                break;
	            case 1:
            		eventStoreImpl.insert(new Event("span", Instant.now().toEpochMilli()));
	                break;
	            case 2:
            		eventStoreImpl.insert(new Event("data", Instant.now().toEpochMilli()));
	                break;
	            case 3:
            		eventStoreImpl.insert(new Event("stop", Instant.now().toEpochMilli()));
	                break;
			}
		}
	}
	 
	private static boolean isNumber(String value) {
		Pattern pattern = Pattern.compile("-?\\d+(\\.\\d+)?");
	    if (value == null) {
	        return false; 
	    }
	    return pattern.matcher(value).matches();
	}
}
