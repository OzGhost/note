package org.qpro;

import java.io.*;

public class YourAnswer {

    private static final int C0 = (int)'0';
    private static final int C9 = (int)'9';

    public int answerTo(InputStream input) throws Exception {
        try (BufferedInputStream is = new BufferedInputStream(input)) {
            Reader r = new Reader(is);
            int n = r.next();
            int l = r.next();
            Cluster[] clusters = new Cluster[n + 1];
            int[] clusterSize = new int[n];
            int cname = 0;
            for (int i = 0; i < l; i++) {
                int left = r.next();
                int right = r.next();
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

