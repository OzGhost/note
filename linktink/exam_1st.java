
import java.io.File;
import java.io.FileOutputStream;
import java.util.Random;

public class Exam1st {

	private static final int PRESSOR = 2;
	private static final byte[] FAILMSG = "NOT FOUND!".getBytes();
	private static final Random r = new Random();

	private java.io.OutputStream os;
	int tries = 0;

	@org.junit.Test
	public void test_me() {
		int[][] matrix = new int[][]{
				new int[]{0,1,1,1},
				new int[]{0,0,0,1},
				new int[]{1,1,0,1},
				new int[]{0,0,0,0}
		};
		int w = 4, h = 4;
		matrix = new int[100][50];
		w = 50;
		h = 100;
		os = System.out;
		tries = 0;
		doSearch(matrix, w, h, 0, 1, 48, 92);
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
		m[cy][cx] = PRESSOR;
		tries++;
		if (tries > 10000) {
			print(xb, yb, l, m, w, h);
			throw new RuntimeException("Out of tries");
		}
		if (cx == dx && cy == dy) {
			print(xb, yb, l, m, w, h);
			return true;
		}
		boolean hit = false;
		int[] xbasket = new int[]{cx+1, cx-1, cx, cx};
		int[] ybasket = new int[]{cy, cy, cy+1, cy-1};
		int[] sb = shuffle();
		for (int i: sb) {
			int nx = xbasket[i], ny = ybasket[i];
			if (hit) break;
			if (stepable(nx, ny, m, w, h)) {
				hit = takeAStep(nx, ny, m, w, h, xb, yb, l, dx, dy);
			}
		}
		l--;
		return hit;
	}

	private void print(int[] xb, int[] yb, int l, int[][] m, int w, int h) {
		for (int i = 0; i < l; i++) {
			silentWrite(("("+yb[i]+","+xb[i]+")").getBytes());
			m[yb[i]][xb[i]] = 8;
		}
		System.out.println("\nEnd up with l: " + l);
		try (FileOutputStream fos = new FileOutputStream(new File("/tmp/peesee"))) {
			for (int i = 0; i < h; i++) {
				for (int j = 0; j < w; j++) {
					fos.write((m[i][j] + " ").getBytes());
				}
				fos.write((byte)'\n');
			}
			fos.write((byte)'\n');
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	private int[] shuffle() {
		int[] base = new int[]{0,1,2,3};
		for (int i = 0; i < 4; i++) {
			int rp = r.nextInt(4);
			int tmp = base[rp];
			base[rp] = base[i];
			base[i] = tmp;
		}
		return base;
	}

	private boolean stepable(int nx, int ny, int[][] m, int w, int h) {
		return nx >=0 && nx < w && ny >=0 && ny < h && m[ny][nx] == 0;
	}
}

