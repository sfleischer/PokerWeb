package hello;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

public class PokerMapTest {

	PokerMapSmall map;

	@Before
	public void setup() {
		map = new PokerMapSmall(8);
	}

	@Test
	public void testContainsEmpty() {
		assertFalse(map.containsKey(1));
	}

	@Test
	public void testPutWithContains() {
		map.put(2, 0);
		assertTrue(map.containsKey(2));
	}

	@Test
	public void testPutWithoutContains() {
		map.put(2, 0);
		assertFalse(map.containsKey(3));
	}

	@Test
	public void testPutMultiple() {
		map.put(2, 0);
		map.put(5, 0);
		map.put(7, 0);
		assertTrue(map.containsKey(2));
		assertTrue(map.containsKey(5));
		assertTrue(map.containsKey(7));
	}

	@Test
	public void testPutOverSize() {
		map.put(20, 0);
		assertTrue(map.containsKey(20));
	}

	@Test
	public void testPutResize() {
		map.put(-1, 0);
		map.put(1, 0);
		map.put(2, 0);
		map.put(3, 0);
		map.put(4, 0);
		map.put(5, 0);
		map.put(6, 0);
		map.put(7, 0);
		map.put(8, 0);
		map.put(9, 0);
		assertTrue(map.containsKey(-1));
		assertTrue(map.containsKey(1));
		assertTrue(map.containsKey(2));
		assertTrue(map.containsKey(3));
		assertTrue(map.containsKey(4));
		assertTrue(map.containsKey(5));
		assertTrue(map.containsKey(6));
		assertTrue(map.containsKey(7));
		assertTrue(map.containsKey(8));
	}

	@Test
	public void testPutOverride() {
		map.put(20, 0);
		assertEquals(0, map.put(20, 3));
	}

	@Test
	public void testPutWithGet() {
		map.put(2, 0);
		assertEquals(0, map.get(2));
	}

	@Test
	public void testPutWithoutGet() {
		map.put(2, 0);
		assertEquals(0, map.get(3));
	}

	@Test
	public void testGetMultiple() {
		map.put(2, 1);
		map.put(5, 2);
		map.put(7, 3);
		assertEquals(1, map.get(2));
		assertEquals(2, map.get(5));
		assertEquals(3, map.get(7));
	}

	@Test
	public void testPutOverSizeWithGet() {
		map.put(20, 0);
		assertEquals(0, map.get(20));
	}

	@Test
	public void testPutResizeWithGet() {
		map.put(-1, -1);
		map.put(1, 1);
		map.put(2, 2);
		map.put(3, 3);
		map.put(4, 4);
		map.put(5, 5);
		map.put(6, 6);
		map.put(7, 7);
		map.put(8, 8);
		map.put(9, 9);
		assertEquals(-1, map.get(-1));
		assertEquals(1, map.get(1));
		assertEquals(2, map.get(2));
		assertEquals(3, map.get(3));
		assertEquals(4, map.get(4));
		assertEquals(5, map.get(5));
		assertEquals(6, map.get(6));
		assertEquals(7, map.get(7));
		assertEquals(8, map.get(8));
		assertEquals(9, map.get(9));
	}

	@Test
	public void testPutForceCollision() {
		map.put(2, 2);
		map.put(1L << 33, 3);
		assertTrue(map.containsKey(2));
		assertTrue(map.containsKey(1L << 33));
	}

	@Test
	public void testPutForceCollisionWithGet() {
		map.put(2, 2);
		long h = (1L << 33);
		assertEquals(0, map.put(h, 10));
		assertEquals(2, map.get(2));
		assertEquals(10, map.get(h));
	}

	@Test
	public void testPutForceCollisionResize() {
		
		long k1 = (1L << 33);
		long k2 = 12L + (1L << 35) + (1L << 34) + (1L << 33);
		long k3 = 1 + (1L << 33) + (1L << 32);
		long k4 = 3 + (1L << 32);
		long k5 = 7 + (1L << 34) + (1L << 32);
		long k6 = 15 + (1L << 35) + (1L << 34) + (1L << 32);
		long k7 = 4 + (1L << 34) + (1L << 33);
		long k8 = 8 + (1L << 35) + (1 << 33);
		long k9 = 5 + (1L << 34) + (1L << 33) + (1L << 32);

		map.put(2, -1);
		map.put(k1, 1);
		map.put(k2, 2);
		map.put(k3, 3);
		map.put(k4, 4);
		map.put(k5, 5);
		map.put(k6, 6);
		map.put(k7, 7);
		map.put(k8, 8);
		map.put(k9, 9);

		assertEquals(-1, map.get(2));
		assertEquals(1, map.get(k1));
		assertEquals(2, map.get(k2));
		assertEquals(3, map.get(k3));
		assertEquals(4, map.get(k4));
		assertEquals(5, map.get(k5));
		assertEquals(6, map.get(k6));
		assertEquals(7, map.get(k7));
		assertEquals(8, map.get(k8));
		assertEquals(9, map.get(k9));
	}

	@Test
	public void testPutForceCollisionResizeMixed() {
		
		long k1 = (1L << 33);
		long k2 = 12L + (1L << 35) + (1L << 34) + (1L << 33);
		long k3 = 1 + (1L << 33) + (1L << 32);
		long k4 = 3 + (1L << 32);
		long k5 = 7 + (1L << 34) + (1L << 32);
		long k6 = 15 + (1L << 35) + (1L << 34) + (1L << 32);
		long k7 = 4 + (1L << 34) + (1L << 33);
		long k8 = 8 + (1L << 35) + (1 << 33);
		long k9 = 5 + (1L << 34) + (1L << 33) + (1L << 32);
		map.put(2, -1);
		map.put(k1, 1);
		map.put(k2, 2);
		map.put(k3, 3);
		map.put(k4, 4);
		map.put(k5, 5);
		map.put(k6, 6);
		map.put(k7, 7);
		map.put(k8, 8);
		map.put(k9, 9);
		map.put(3, 13);
		map.put(4, 14);
		map.put(5, 15);

		assertEquals(-1, map.get(2));
		assertEquals(1, map.get(k1));
		assertEquals(2, map.get(k2));
		assertEquals(3, map.get(k3));
		assertEquals(4, map.get(k4));
		assertEquals(5, map.get(k5));
		assertEquals(6, map.get(k6));
		assertEquals(7, map.get(k7));
		assertEquals(8, map.get(k8));
		assertEquals(9, map.get(k9));
		assertEquals(13, map.get(3));
		assertEquals(14, map.get(4));
		assertEquals(15, map.get(5));
	}
}