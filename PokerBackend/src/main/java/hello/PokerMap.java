package hello;
import java.util.Objects;

class PokerMap {
	
	int size;

	static final int MAXIMUM_CAPACITY = 1 << 28;

    // The load factor used when none specified in constructor.
    static final float DEFAULT_LOAD_FACTOR = 0.75f;

    static int[] primes = {0, 1, 3, 7, 13, 31, 61, 127, 251, 509, 1021, 2039,
4093, 8191, 16381, 32749, 65521, 131071, 262139, 524287, 1048573, 2097143, 4194301, 8388593,
16777213, 33554393, 67108859, 134217689, 268435399};

    Entry[] table;

    int threshold;

    int prime;

    int lgCapacity;

    static int hash(int h, int length) {
        h ^= (h >>> 20) ^ (h >>> 12);
        h ^= (h >>> 7) ^ (h >>> 4);
        return h & (length - 1);
    }

    int doublehash(int h, int length, int i) {
    	int h1 = h;
    	h1 ^= (h1 >>> 20) ^ (h1 >>> 12);
        h1 ^= (h1 >>> 7) ^ (h1 >>> 4);
        h1 &= (length - 1);

    	int h2 = prime - (h % prime);
    	return (h1 + i * h2) % length;
    }

    static int longHash(long value) {
    	return (int) (value ^ (value >>> 32));
    }

    

    /**
     * Constructs an empty PokerMap with the specified initial capacity and load factor.
     *
     * @param initialCapacity the initial capacity
     * @param loadFactor      the load factor
     * @throws IllegalArgumentException if the initial capacity is nonpositive, or the load factor
     *                                  is nonpositive or NaN
     */
    @SuppressWarnings("unchecked")
    public PokerMap(int initialCapacity) {
        if (initialCapacity <= 0) {
            throw new IllegalArgumentException(
                    "Illegal initial capacity: " + initialCapacity);
        }
        if (initialCapacity > MAXIMUM_CAPACITY) {
            initialCapacity = MAXIMUM_CAPACITY;
        }

        // Find a power of 2 >= initialCapacity
        int capacity = 1;
        this.lgCapacity = 0;
        while (capacity < initialCapacity) {
        	this.lgCapacity++;
            capacity = 1 << this.lgCapacity;
        }
        this.prime = primes[lgCapacity];

        this.threshold = (int) (capacity * DEFAULT_LOAD_FACTOR);
        this.table = new Entry[capacity];
    }

    public int put(long key, int value) {
    	int i = 0;
    	int bucket = 0;
    	do {
    		bucket = doublehash(longHash(key), table.length, i++);
    		if (table[bucket] == null) {
    			Entry insert = new Entry(key, value);
    			table[bucket] = insert;
    			size++;
    			if (size >= threshold) {
    				resize();
    			}
    			return 0;
    		}
    	} while (table[bucket].key != key);

    	int temp = table[bucket].value;
    	table[bucket].value = value;
    	return temp;
    }

    public int get(long key) {
    	int i = 0;
    	int bucket = 0;
    	do {
    		bucket = doublehash(longHash(key), table.length, i++);
    		if (table[bucket] == null) {
    			return 0;
    		}
    	} while (table[bucket].key != key);

        return table[bucket].value;
    }

    public boolean containsKey(long key) {
    	int i = 0;
    	int bucket = 0;
    	do {
    		bucket = doublehash(longHash(key), table.length, i++);
    		if (table[bucket] == null) {
    			return false;
    		}
    	} while (table[bucket].key != key);

        return true;
    }

    void resize() {
        Entry[] oldTable = table;
        int oldCapacity = oldTable.length;

        if (oldCapacity == MAXIMUM_CAPACITY || this.lgCapacity >= 28) {
            threshold = Integer.MAX_VALUE;
            return;
        }

        this.lgCapacity++;
        this.prime = primes[lgCapacity];
        int newCapacity = 1 << this.lgCapacity;

        this.table = new Entry[newCapacity];

        for (Entry insert : oldTable) {
        	if (insert == null) {
        		continue;
        	}
            int i = 0;
	    	int bucket = 0;
	    	do {
	    		bucket = doublehash(longHash(insert.key), table.length, i++);
	    	} while (table[bucket] != null);
			table[bucket] = insert;
        }

        threshold = (int) (newCapacity * DEFAULT_LOAD_FACTOR);
    }

    public void clear() {
        size = 0;
        for (int i = 0; i < table.length; i++) {
            table[i] = null;
        }
    }


    static final class Entry {
    	long key;
    	int value;

    	Entry(long k, int v) {
    		key = k;
    		value = v;
    	}

    	@Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (o == null || getClass() != o.getClass()) {
                return false;
            }
            Entry entry = (Entry) o;
            return this.key == entry.key
                && this.value == entry.value;
        }

        @Override
        public int hashCode() {
            return Objects.hash(key, value);
        }

        @Override
        public String toString() {
            return "Entry{"
                + "key=" + key
                + ", value=" + value
                + '}';
        }
    }
}