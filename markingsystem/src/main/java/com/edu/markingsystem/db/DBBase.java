package com.edu.markingsystem.db;

import org.mapdb.DB;
import org.mapdb.HTreeMap;

public class DBBase<K,V> {
	
	protected Database dbCoordinator;
	protected DB db;
	protected HTreeMap<?,?> map;
	
	public DBBase(Database dbCoordinator, DB db, HTreeMap<?,?> map) {
		this.dbCoordinator = dbCoordinator; 
		this.db = db;
		this.map = map;
		
	}
	
}