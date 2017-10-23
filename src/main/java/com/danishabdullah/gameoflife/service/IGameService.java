package com.danishabdullah.gameoflife.service;

import com.danishabdullah.gameoflife.model.Game;

import java.util.List;

public interface IGameService {
    public List<Game> findAll();

    public Game findById(int id);

    public void create(Game game);
}
