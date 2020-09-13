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

    private void askFor(String prefix) throws Exception {
        String p = "src/test/resources/tcset/";
        try (InputStream is = new FileInputStream(new File(p + prefix + "_input.txt" ));
                InputStream ex = new FileInputStream(new File(p + prefix + "_output.txt" ))
        ) {
            int ans = new YourAnswer().answerTo(is);
            Scanner sc = new Scanner(ex);
            int trueans = sc.nextInt();
            org.junit.Assert.assertEquals(trueans, ans);
        } catch(Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}

