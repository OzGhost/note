package org.qpro;

import org.junit.Test;
import java.io.*;
import java.util.*;

public class MyTest {

    @Test
    public void firstCase() throws Exception {
        askFor("tc1");
    }

    @Test
    public void secondCase() throws Exception {
        askFor("tc2");
    }

    @Test
    public void thirdCase() throws Exception {
        askFor("tc3");
    }

    @Test
    public void fourthCase() throws Exception {
        askFor("tc4");
    }

    private void askFor(String prefix) throws Exception {
        String p = "src/test/resources/tcset/";
        try ( InputStream ex = new FileInputStream(new File(p + prefix + "_output.txt" ))) {
            File inf = new File(p+prefix+"_input.txt");
            long beginning = System.nanoTime();
            int ans = new YourAnswer().answerTo(inf);
            System.out.println(prefix + " take " + (System.nanoTime() - beginning));
            Scanner sc = new Scanner(ex);
            int trueans = sc.nextInt();
            org.junit.Assert.assertEquals(trueans, ans);
        } catch(Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    private static class YourAnswer {

        private static final int C0 = (int)'0';
        private static final int C9 = (int)'9';

        public int answerTo(File inf) throws Exception {
            try (BufferedReader br = new BufferedReader(new FileReader(inf))) {
                int n = Integer.parseInt(br.readLine());
                int l = Integer.parseInt(br.readLine());
                Cluster[] clusters = new Cluster[n + 1];
                int[] clusterSize = new int[n];
                int cname = 0;
                for (int i = 0; i < l; i++) {
                    String[] pieces = br.readLine().split(" ");
                    int left = Integer.parseInt(pieces[0]);
                    int right = Integer.parseInt(pieces[1]);
                    Cluster leftCluster = clusters[left];
                    Cluster rightCluster = clusters[right];
                    if (leftCluster == null) {
                        if (rightCluster == null) {
                            clusters[left] = clusters[right] = new Cluster(cname++);
                            clusterSize[clusters[left].alias] = 2;
                        } else {
                            clusters[left] = clusters[right];
                            clusterSize[clusters[left].alias]++;
                        }
                    } else {
                        if (rightCluster == null) {
                            clusters[right] = clusters[left];
                            clusterSize[clusters[left].alias]++;
                        } else {
                            if (leftCluster.alias != rightCluster.alias) {
                                clusterSize[rightCluster.alias] += clusterSize[leftCluster.alias];
                                clusterSize[leftCluster.alias] = 0;
                                leftCluster.alias = rightCluster.alias;
                            }
                        }
                    }
                }
                int maxSize = clusterSize[0];
                for (int i = 1; i < cname; i++) {
                    int size = clusterSize[i];
                    if (size > maxSize) maxSize = size;
                }
                return maxSize;
            }
        }

        private static class Cluster {
            int alias;
            Cluster(int n){
                alias = n;
            }
        }

        private static class Reader {
            private InputStream is;
            private Reader(InputStream i) {
                is = i;
            }
            private int next() throws Exception {
                int r;
                while ( (r = is.read()) < C0 || r > C9 ) { }
                int x = r - C0;
                while ( (r = is.read()) >= C0 && r <= C9 ) {
                    x = x*10 + (r - C0);
                }
                return x;
            }
        }
    }
}

