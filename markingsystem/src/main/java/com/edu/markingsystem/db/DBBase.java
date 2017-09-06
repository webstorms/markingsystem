package com.edu.markingsystem.db;

import org.mapdb.DB;
import org.mapdb.HTreeMap;

public class DBBase<K,V> {
	
	protected DB db;
	protected HTreeMap<?,?> map;
	
	public DBBase(DB db, HTreeMap<?,?> map) {
		this.db = db;
		this.map = map;
		
	}
	
	
	
	
}