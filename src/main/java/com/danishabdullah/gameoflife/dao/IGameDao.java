package com.danishabdullah.gameoflife.dao;

import com.danishabdullah.gameoflife.model.Game;

public interface IGameDao {
    void create(Game game);

    void update(Game game);

    Game getGameById(long id);

    void delete(long id);

}
