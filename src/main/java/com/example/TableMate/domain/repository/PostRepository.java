package com.example.TableMate.domain.repository;

import com.example.TableMate.domain.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
