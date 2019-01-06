package hello;

public class Combinations implements Iterator<ArrayList<Integer>> {
		int[] temp;
		int[] input;
		boolean hasNext;

		public Combinations(int[] arr, int num) {
			if (arr.length < num) {
				hasNext = false;
				return;
			}
			input = arr;
			temp = new int[num];

			for (int i = 0; i < num - 1; i++) {
				indices[i] = i;
			}
			hasNext = true;
		}

		public boolean hasNext() {
			return hasNext;
		}

		public ArrayList<Integer> next() {
			if (!hasNext) {
				throw new NoSuchElementException();
			}
			ArrayList<Integer> ans = new ArrayList<Integer>();
			for(int i : temp) {
				ans.add(i);
			}

	        for (i = num - 1; i >= 0 && temp[i] == input.length - num + i; i--); 
	        if (i < 0) {
	            hasNext = false;
	        }
	        temp[i]++;                    // increment this item
	        for (++i; i < num; i++) {    // fill up remaining items
	            temp[i] = temp[i - 1] + 1; 
	        }
	        return ans;
		}
	}