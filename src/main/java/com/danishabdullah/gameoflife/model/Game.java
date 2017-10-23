package com.danishabdullah.gameoflife.model;

import javax.persistence.*;

@Entity
@Table(name = "gamesoflife")
public class Game {
    @Id
    private int id;
    @Column(name = "worldX")
    private int worldX;
    @Column(name = "worldY")
    private int worldY;
    @Column(name = "aliveCells",
            columnDefinition="CLOB NOT NULL")
    private String aliveCells;

    public Game (){}

    public Game(int id, int worldX, int worldY, String aliveCells) {
        this.id = id;
        this.worldX = worldX;
        this.worldY = worldY;
        this.aliveCells = aliveCells;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Lob
    public String getAliveCells() {
        return aliveCells;
    }

    public void setAliveCells(String aliveCells) {
        this.aliveCells = aliveCells;
    }

    public int getWorldX() {
        return worldX;
    }

    public void setWorldX(int worldX) {
        this.worldX = worldX;
    }

    public int getWorldY() {
        return worldY;
    }

    public void setWorldY(int worldY) {
        this.worldY = worldY;
    }


    @Override
    public String toString() {
        return "Game{" + "id=" + id + ", aliveCells=" + aliveCells +
                ", worldX=" + worldX + '}' + ", worldY=" + worldY + '}';
    }
}
