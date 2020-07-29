
public class Exam1st {

	@org.junit.Test
	public void test_me() {
		int[][] matrix = new int[][]{
				new int[]{0,1,1,1},
				new int[]{0,0,0,1},
				new int[]{1,1,0,1},
				new int[]{0,0,0,0}
		};
		int w = 4, h = 4;
		doSearch(matrix, w, h, 0, 1, 3, 3);
	}

	private void doSearch(int[][] m, int w, int h, int ex, int ey, int ox, int oy) {
		int l = 0;
		int[] xb = new int[w*h], yb = new int[w*h];
		boolean[][] footprint = new boolean[h][w];
		boolean found = takeAStep(ex, ey, m, w, h, xb, yb, l, ox, oy, footprint);
		if (!found) {
			System.out.println("NOT FOUND!");
		}
	}

	private boolean takeAStep(int cx, int cy, int[][] m, int w, int h, int[] xb, int[] yb, int l, int dx, int dy, boolean[][] footprint) {
		xb[l] = cx;
		yb[l] = cy;
		l++;
		footprint[cy][cx] = true;
		if (cx == dx && cy == dy) {
			print(xb, yb, l);
			return true;
		}
		boolean hit = false;
		int nx = cx+1, ny = cy;
		if (stepable(nx, ny, m, w, h, footprint)) {
			hit = takeAStep(nx, ny, m, w, h, xb, yb, l, dx, dy, footprint);
		}
		nx = cx-1; ny = cy;
		if (!hit && stepable(nx, ny, m, w, h, footprint)) {
			hit = takeAStep(nx, ny, m, w, h, xb, yb, l, dx, dy, footprint);
		}
		nx = cx; ny = cy+1;
		if (!hit && stepable(nx, ny, m, w, h, footprint)) {
			hit = takeAStep(nx, ny, m, w, h, xb, yb, l, dx, dy, footprint);
		}
		nx = cx; ny = cy-1;
		if (!hit && stepable(nx, ny, m, w, h, footprint)) {
			hit = takeAStep(nx, ny, m, w, h, xb, yb, l, dx, dy, footprint);
		}
		l--;
		footprint[cy][cx] = false;
		return hit;
	}

	private void print(int[] xb, int[] yb, int l) {
		for (int i = 0; i < l; i++) {
			System.out.print("("+yb[i]+","+xb[i]+")");
		}
		System.out.println();
	}

	private boolean stepable(int nx, int ny, int[][] m, int w, int h, boolean[][] footprint) {
		return nx >=0 && nx < w && ny >=0 && ny < h && m[ny][nx] == 0 && !footprint[ny][nx];
	}
}

