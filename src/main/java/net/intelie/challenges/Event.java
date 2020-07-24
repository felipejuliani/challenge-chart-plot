package net.intelie.challenges;

import java.util.UUID;

/**
 * This is just an event stub, feel free to expand it if needed.
 */
public class Event {
	
	private final String key = UUID.randomUUID().toString();
    private final String type;
    private final long timestamp;

    public Event(String type, long timestamp) {
        this.type = type;
        this.timestamp = timestamp;
    }

    public String key() {
        return key;
    }
    
    public String type() {
        return type;
    }

    public long timestamp() {
        return timestamp;
    }
}
