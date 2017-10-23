package com.danishabdullah.gameoflife.dao;

import com.danishabdullah.gameoflife.dao.IGameDao;
import com.danishabdullah.gameoflife.model.Game;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository

public class GameDao implements IGameDao {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(Game game) {
        entityManager.persist(game);
    }

    @Override
    public void update(Game game) {
        entityManager.merge(game);
    }

    @Override
    public Game getGameById(long id) {
        return entityManager.find(Game.class, id);
    }

    @Override
    public void delete(long id) {
        Game game = getGameById(id);
        if (game != null) {
            entityManager.remove(game);
        }
    }


}
