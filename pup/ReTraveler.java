package pup;

import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.Set;

public class ReTraveler {

	private Class<?> type;
	private String ns = "";
	private static Map<String, String[]> plookup = new HashMap<>();
	private Set<String> over = new HashSet<>();
	private int pMode;
	
	static {
		plookup.put("java.util.List", new String[]{"Li"});
		plookup.put("java.util.Map", new String[]{"Mk", "Mv"});
		plookup.put("java.util.Set", new String[]{"Si"});
		plookup.put("java.util.TreeSet", new String[]{"Ti"});
		plookup.put("java.util.EnumSet", new String[]{"Ei"});
		plookup.put("ch.ivyteam.ivy.scripting.objects.List", new String[]{"Ii"});
		plookup.put("java.lang.Class", new String[]{"Ci"});
	}
	
	public ReTraveler withType(Class<?> t) {
		type = t;
		return this;
	}
	
	public ReTraveler withDebug() {
		pMode = 1;
		return this;
	}
	
	public void searchOn(Class<?> t) {
		Deque<TNode> dq = new LinkedList<>();
		dq.push(TNode.of("r", t));
		while ( ! dq.isEmpty()) {
			TNode n = dq.pop();
			test(n);
			if (isPrime(n.t) || over.contains(n.t.toString())) continue;
			over.add(n.t.toString());
			for (Method m: n.t.getMethods()) {
				String fname;
				if (m.getParameterCount() == 0 && (fname = getFName(m.getName())) != null && !"class".equals(fname)) {
					dig(m.getGenericReturnType(), fname, dq, n.ac);
				}
			}
		}
	}
	
	private boolean isPrime(Type ot) {
		boolean f1 = false;
		if (ot instanceof Class) {
			Class ct = (Class)ot;
			f1 = ct.isPrimitive()
					|| ct.isEnum()
					|| ct.getSuperclass() == Number.class;
		}
		return f1
				|| ot == String.class
				|| ot == Class.class
				|| ot == java.util.Calendar.class;
	}
	
	private void test(TNode n) {
		if (pMode == 1)
			yell("DEBUG: " + n.ac + " -> " + n.t.getCanonicalName());
		if (type != null && !n.t.getCanonicalName().equals("java.lang.Object") && n.t.isAssignableFrom(type)) {
			yell(" ==> Found at: " + n.ac + " -> " + n.t.getCanonicalName());
		}
	}
	
	private void yell(String msg) {
		Pup.bark(msg);
	}
	
	private String getFName(String mName) {
		if (mName.startsWith("get") && mName.length() > 3) {
			return (char)(mName.charAt(3)+'a'-'A') + mName.substring(4);
		}
		if (mName.startsWith("is") && mName.length() > 2) {
			return (char)(mName.charAt(2)+'a'-'A') + mName.substring(3);
		}
		return null;
	}
	
	private void dig(Type ot, String fname, Deque<TNode> dq, String ac) {
		if (isPrime(ot)) {
			dq.push(TNode.of(ac + '.' + fname, (Class)ot));
			return;
		}
		if (ot instanceof ParameterizedType) {
			ParameterizedType pt = (ParameterizedType)ot;
			String rawName = pt.getRawType().getTypeName();
			String[] ats = plookup.get(rawName);
			if (rawName.contains(ns)) {
				if (pt.getRawType() instanceof Class) {
					dq.push(TNode.of(ac + '.' + fname, (Class)pt.getRawType()));
				} else {
					yell("Expect Class but was: " + pt.getRawType().getClass().getCanonicalName());
				}
			} else if (ats == null) {
				yell("Found unknow raw type: " + rawName);
			}
			if (ats != null) {
				Type[] tt = pt.getActualTypeArguments();
				for (int i = 0; i < ats.length; i++) {
					Type ti = tt[i];
					if (ti.getTypeName().contains(ns)) {
						dig(ti, fname+'$'+ats[i], dq, ac);
					}
				}
			}
			if (ats == null && rawName.contains(ns)) {
				int i = 0;
				for (Type tt: pt.getActualTypeArguments()) {
					dig(tt, fname+"$P$"+(++i), dq, ac);
				}
			}
		} else if (ot instanceof Class) {
			Class ct = (Class) ot;
			dq.push(TNode.of(ac + '.' + fname, ct));
		} else {
			yell("Found unknow type: " + ot.getClass().getCanonicalName());
		}
	}
	
	private static class TNode {
		String ac;
		Class<?> t;
		
		public static TNode of (String a, Class<?> x) {
			TNode o = new TNode();
			o.ac = a;
			o.t = x;
			return o;
		}
	}
}
