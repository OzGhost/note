
public class Exam1st {

	private static final int PRESSOR = 2;
	private static final int LIFTER = ~PRESSOR;
	private static final byte[] TEMPLATE = "(y,x)".getBytes();
	private static final byte[] FAILMSG = "NOT FOUND!".getBytes();

	private java.io.OutputStream os;

	@org.junit.Test
	public void test_me() {
		int[][] matrix = new int[][]{
				new int[]{0,1,1,1},
				new int[]{0,0,0,1},
				new int[]{1,1,0,1},
				new int[]{0,0,0,0}
		};
		int w = 4, h = 4;
		os = System.out;
		doSearch(matrix, w, h, 0, 1, 3, 3);
	}

	private void doSearch(int[][] m, int w, int h, int ex, int ey, int ox, int oy) {
		int l = 0;
		int[] xb = new int[w*h], yb = new int[w*h];
		boolean found = takeAStep(ex, ey, m, w, h, xb, yb, l, ox, oy);
		if (!found) {
			silentWrite(FAILMSG);
		}
	}

	private void silentWrite(byte... b) {
		try { os.write(b); } catch(Throwable ignored) {}
	}

	private boolean takeAStep(int cx, int cy, int[][] m, int w, int h, int[] xb, int[] yb, int l, int dx, int dy) {
		xb[l] = cx;
		yb[l] = cy;
		l++;
		m[cy][cx] |= PRESSOR;
		if (cx == dx && cy == dy) {
			print(xb, yb, l);
			return true;
		}
		boolean hit = false;
		int nx = cx+1, ny = cy;
		if (stepable(nx, ny, m, w, h)) {
			hit = takeAStep(nx, ny, m, w, h, xb, yb, l, dx, dy);
		}
		nx = cx-1; ny = cy;
		if (!hit && stepable(nx, ny, m, w, h)) {
			hit = takeAStep(nx, ny, m, w, h, xb, yb, l, dx, dy);
		}
		nx = cx; ny = cy+1;
		if (!hit && stepable(nx, ny, m, w, h)) {
			hit = takeAStep(nx, ny, m, w, h, xb, yb, l, dx, dy);
		}
		nx = cx; ny = cy-1;
		if (!hit && stepable(nx, ny, m, w, h)) {
			hit = takeAStep(nx, ny, m, w, h, xb, yb, l, dx, dy);
		}
		l--;
		m[cy][cx] &= LIFTER;
		return hit;
	}

	private void print(int[] xb, int[] yb, int l) {
		for (int i = 0; i < l; i++) {
			TEMPLATE[1] = (byte)(yb[i] + '0');
			TEMPLATE[3] = (byte)(xb[i] + '0');
			silentWrite(TEMPLATE);
		}
		silentWrite((byte)'\n');
	}

	private boolean stepable(int nx, int ny, int[][] m, int w, int h) {
		return nx >=0 && nx < w && ny >=0 && ny < h && m[ny][nx] == 0;
	}
}

